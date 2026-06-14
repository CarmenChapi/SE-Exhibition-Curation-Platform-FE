import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ListCollections from "./ListCollections";
import { addCollection, getCollectionByUserMail } from "../../utils/api";

vi.mock("../../utils/api", () => ({
  getCollectionByUserMail: vi.fn(),
  addCollection: vi.fn(),
}));

vi.mock("../../hooks/useAuth", () => ({
  useAuth: () => ({
    user: { email: "curator@example.com" },
  }),
}));

vi.mock("./CollectionCard", () => ({
  default: ({ collection }) => (
    <li data-testid="collection-card">{collection.title}</li>
  ),
}));

vi.mock("../MenuCollections", () => ({
  default: () => <div>Menu collections</div>,
}));

vi.mock("../UserProfile", () => ({
  default: () => <div>User profile</div>,
}));

vi.mock("../TopButton", () => ({
  default: () => <button type="button">Top</button>,
}));

vi.mock("../BackControl", () => ({
  default: () => <button type="button">Back</button>,
}));

const collections = [
  { id_collection: 10, title: "Favourites", art_count: 2 },
  { id_collection: 20, title: "Impressionism", art_count: 4 },
];

describe("Test Set for ListCollections", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("Test 1 => Shows a loading message while collections are being fetched", () => {
    getCollectionByUserMail.mockReturnValue(new Promise(() => {}));

    render(<ListCollections />);

    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.getByText(/loading collections/i)).toBeInTheDocument();
  });

  it("Test 2 => Load and displays the user's collections", async () => {
    getCollectionByUserMail.mockResolvedValue(collections);

    render(<ListCollections />);

    expect(
      await screen.findByRole("heading", { name: /my private exhibitions/i }),
    ).toBeInTheDocument();
    expect(getCollectionByUserMail).toHaveBeenCalledWith(
      "curator@example.com",
    );
    expect(screen.getByText("Favourites")).toBeInTheDocument();
    expect(screen.getByText("Impressionism")).toBeInTheDocument();
  });

  it("Test 3 => Show a message when the user has no collections", async () => {
    getCollectionByUserMail.mockResolvedValue([]);

    render(<ListCollections />);

    expect(
      await screen.findByText(/no collections created yet/i),
    ).toBeInTheDocument();
  });

  it("Test 4 => Create a collection by submitting the form with Enter", async () => {
    const newCollection = {
      id_collection: 30,
      title: "Modern Art",
    };
    getCollectionByUserMail.mockResolvedValue(collections);
    addCollection.mockResolvedValue(newCollection);

    render(<ListCollections />);

    const input = await screen.findByPlaceholderText(/add name/i);
    fireEvent.change(input, { target: { value: "Modern Art" } });
    fireEvent.submit(input.closest("form"));

    await waitFor(() => {
      expect(addCollection).toHaveBeenCalledWith({
        title: "Modern Art",
        user_mail: "curator@example.com",
        art_count: 0,
      });
    });
    expect(await screen.findByText("Modern Art")).toBeInTheDocument();
    expect(input).toHaveValue("");
  });

  it("Test 5 => Shows a validation error when the collection title is empty", async () => {
    getCollectionByUserMail.mockResolvedValue([]);

    render(<ListCollections />);

    fireEvent.click(
      await screen.findByRole("button", { name: /create collection/i }),
    );

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Title cannot be empty!",
    );
    expect(addCollection).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole("button", { name: /return to form/i }));
    expect(await screen.findByPlaceholderText(/add name/i)).toBeInTheDocument();
  });

  it("Test 6 => Shows an error when loading collections fails", async () => {
    getCollectionByUserMail.mockRejectedValue(new Error("API unavailable"));

    render(<ListCollections />);

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Error: API unavailable",
    );
  });

  it("Test 7 => Shows an error when creating a collection fails", async () => {
    getCollectionByUserMail.mockResolvedValue([]);
    addCollection.mockRejectedValue(new Error("Could not create collection"));

    render(<ListCollections />);

    fireEvent.change(await screen.findByPlaceholderText(/add name/i), {
      target: { value: "Modern Art" },
    });
    fireEvent.click(screen.getByRole("button", { name: /create collection/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Error: Could not create collection",
    );
  });
});
