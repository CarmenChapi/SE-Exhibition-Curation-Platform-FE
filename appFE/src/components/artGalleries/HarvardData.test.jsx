import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import axios from "axios";
import HarvardData from "./HarvardData";

vi.mock("axios");

const renderWithProviders = (ui) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={["/"]}>{ui}</MemoryRouter>
    </QueryClientProvider>
  );
};

describe("Test Set for HarvardData Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("Test 1 => Must show loading... ", () => {
    axios.get.mockReturnValue(new Promise(() => {}));
    renderWithProviders(<HarvardData />);
    expect(screen.getByText(/loading harvard art/i)).toBeInTheDocument();
  });

  it("Test 2 => Must get the correct data from the api", async () => {
    const mockData = {
      records: [
        { id: 1, title: "Mona Lisa", primaryimageurl: "url1", people: [{ displayname: "Da Vinci" }] },
        { id: 2, title: "Starry Night", primaryimageurl: "url2", people: [{ displayname: "Van Gogh" }] },
      ],
    };
    axios.get.mockResolvedValue({ data: mockData });

    renderWithProviders(<HarvardData />);

    await waitFor(() => {
      expect(screen.getByText("Mona Lisa")).toBeInTheDocument();
      expect(screen.getByText("Starry Night")).toBeInTheDocument();
    });
  });

  it("Test 3 => Must execute a search when sent the form", async () => {
    axios.get.mockResolvedValue({ data: { records: [] } });
    renderWithProviders(<HarvardData />);

    const input = await screen.findByPlaceholderText(/search in harvard.../i);
    const form = screen.getByRole("search");

    fireEvent.change(input, { target: { value: "Rembrandt" } });
    fireEvent.submit(form);

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(
        expect.stringContaining("https://api.harvardartmuseums.org/object"),
        expect.objectContaining({
          params: expect.objectContaining({ q: "Rembrandt" }),
        })
      );
    });
  });

  it("Test 4 => Should filter elements with image or not depending the checkbox value", async () => {
    const mockData = {
      records: [
        { id: 1, title: "with image", primaryimageurl: "url1", people: [{ displayname: "A" }] },
        { id: 2, title: "no image", primaryimageurl: null, people: [{ displayname: "B" }] },
      ],
    };
    axios.get.mockResolvedValue({ data: mockData });
    renderWithProviders(<HarvardData />);

    await screen.findByText("with image");

    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);

    expect(screen.getByText("with image")).toBeInTheDocument();
    expect(screen.queryByText("no image")).not.toBeInTheDocument();
  });

  it("Test 5 => Must show any error of the API", async () => {
    axios.get.mockRejectedValue(new Error("API Error"));
    renderWithProviders(<HarvardData />);

    await waitFor(() => {
      expect(screen.getByText(/error: api error/i)).toBeInTheDocument();
    });
  });
});
