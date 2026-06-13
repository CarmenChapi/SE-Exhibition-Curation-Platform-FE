import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import AddToCollectionFromApi from "./AddToCollectionFromApi";
import {
  addArtwork,
  addCollection,
  getCollectionByUserMail,
} from "../../utils/api";

const routerMocks = vi.hoisted(() => ({
  location: { state: {} },
  navigate: vi.fn(),
}));

vi.mock("../../utils/api", () => ({
  getCollectionByUserMail: vi.fn(),
  addCollection: vi.fn(),
  addArtwork: vi.fn(),
}));

vi.mock("../../hooks/useAuth", () => ({
  useAuth: () => ({
    user: { email: "curator@example.com" },
  }),
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");

  return {
    ...actual,
    useLocation: () => routerMocks.location,
    useNavigate: () => routerMocks.navigate,
  };
});

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

const artwork = {
  title: "The Starry Night",
  artist: "Vincent van Gogh",
  image_url: "https://example.com/starry-night.jpg",
};

const collections = [
  { id_collection: 10, title: "Favourites", art_count: 2 },
  { id_collection: 20, title: "Impressionism", art_count: 4 },
];

describe("Test Set for AddToCollectionFromApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    routerMocks.location = { state: { artwork } };
  });

  it("Test 1 => Shows a loading message while collections are being fetched", () => {
    getCollectionByUserMail.mockReturnValue(new Promise(() => {}));

    render(<AddToCollectionFromApi />);

    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.getByText(/loading collections/i)).toBeInTheDocument();
  });

  it("Test 2 => Loads and displays the user's collections", async () => {
    getCollectionByUserMail.mockResolvedValue(collections);

    render(<AddToCollectionFromApi />);

    expect(
      await screen.findByRole("heading", {
        name: /add the starry night/i,
      }),
    ).toBeInTheDocument();
    expect(getCollectionByUserMail).toHaveBeenCalledWith(
      "curator@example.com",
    );
    expect(
      screen.getByRole("button", { name: /add artwork to favourites/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /add artwork to impressionism/i }),
    ).toBeInTheDocument();
  });

  it("Test 3 => Shows a message when the user has no collections", async () => {
    getCollectionByUserMail.mockResolvedValue([]);

    render(<AddToCollectionFromApi />);

    expect(
      await screen.findByText(/no collections created yet/i),
    ).toBeInTheDocument();
  });

  it("Test 4 => Adds the artwork to an existing collection and navigates to it", async () => {
    getCollectionByUserMail.mockResolvedValue(collections);
    addArtwork.mockResolvedValue(artwork);

    render(<AddToCollectionFromApi />);

    fireEvent.click(
      await screen.findByRole("button", {
        name: /add artwork to favourites/i,
      }),
    );

    await waitFor(() => {
      expect(addArtwork).toHaveBeenCalledWith(10, artwork);
      expect(routerMocks.navigate).toHaveBeenCalledWith(
        "/home/collections/Favourites/10",
      );
    });
  });

  it("Test 5 => Creates a new collection, adds the artwork and navigates to it", async () => {
    const newCollection = {
      id_collection: 30,
      title: "Post-Impressionism",
    };
    getCollectionByUserMail.mockResolvedValue(collections);
    addCollection.mockResolvedValue(newCollection);
    addArtwork.mockResolvedValue(artwork);

    render(<AddToCollectionFromApi />);

    fireEvent.change(await screen.findByPlaceholderText(/give a name/i), {
      target: { value: "Post-Impressionism" },
    });
    fireEvent.click(
      screen.getByRole("button", {
        name: /add artwork to a new collection/i,
      }),
    );

    await waitFor(() => {
      expect(addCollection).toHaveBeenCalledWith({
        title: "Post-Impressionism",
        user_mail: "curator@example.com",
        art_count: 0,
      });
      expect(addArtwork).toHaveBeenCalledWith(30, artwork);
      expect(routerMocks.navigate).toHaveBeenCalledWith(
        "/home/collections/Post-Impressionism/30",
      );
    });
  });

  it("Test 6 => Shows a validation error when the new collection title is empty", async () => {
    getCollectionByUserMail.mockResolvedValue([]);

    render(<AddToCollectionFromApi />);

    fireEvent.click(
      await screen.findByRole("button", {
        name: /add artwork to a new collection/i,
      }),
    );

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Title cannot be empty!",
    );
    expect(addCollection).not.toHaveBeenCalled();
    expect(addArtwork).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole("button", { name: /return to form/i }));
    expect(await screen.findByPlaceholderText(/give a name/i)).toBeInTheDocument();
  });

  it("Test 7 => Shows an error when loading collections fails", async () => {
    getCollectionByUserMail.mockRejectedValue(new Error("API unavailable"));

    render(<AddToCollectionFromApi />);

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Error: API unavailable",
    );
  });

  it("Test 8 => Shows an error when no artwork was selected", async () => {
    routerMocks.location = { state: {} };
    getCollectionByUserMail.mockResolvedValue(collections);

    render(<AddToCollectionFromApi />);

    fireEvent.click(
      await screen.findByRole("button", {
        name: /add artwork to favourites/i,
      }),
    );

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Error: No artwork selected to add.",
    );
    expect(addArtwork).not.toHaveBeenCalled();
  });
});
