import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import CollectionCard from "./CollectionCard";
import { deleteCollection, updateCollection } from "../../utils/api";

const routerMocks = vi.hoisted(() => ({
  navigate: vi.fn(),
}));

vi.mock("../../utils/api", () => ({
  updateCollection: vi.fn(),
  deleteCollection: vi.fn(),
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");

  return {
    ...actual,
    useNavigate: () => routerMocks.navigate,
  };
});

const collection = {
  id_collection: 10,
  title: "Favourites",
  art_count: 2,
};

const renderCard = (overrides = {}) => {
  const props = {
    collection,
    setListCollections: vi.fn(),
    onValidationError: vi.fn(),
    ...overrides,
  };

  render(<CollectionCard {...props} />);
  return props;
};

describe("Test Set for CollectionCard component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("Test 1 => Renders the collection title, default preview and action buttons", () => {
    renderCard();

    expect(screen.getByText("Favourites")).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: /favourites collection preview/i }),
    ).toHaveAttribute("src", expect.stringContaining("collectionPreview"));
    expect(
      screen.getByRole("button", { name: /edit collection/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /delete collection/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /open collection/i }),
    ).toBeInTheDocument();
  });

  it("Test 2 => Does not show the open button for an empty collection", () => {
    renderCard({
      collection: { ...collection, art_count: 0 },
    });

    expect(
      screen.queryByRole("button", { name: /open collection/i }),
    ).not.toBeInTheDocument();
  });

  it("Test 3 => Navigates to the collection and add-artwork pages", () => {
    renderCard();

    fireEvent.click(
      screen.getByRole("button", { name: /open collection/i }),
    );
    expect(routerMocks.navigate).toHaveBeenCalledWith(
      "/home/collections/Favourites/10",
    );

    fireEvent.click(
      screen.getByRole("button", { name: /add artwork to collection/i }),
    );
    expect(routerMocks.navigate).toHaveBeenCalledWith(
      "/home/collections/Favourites/10/add",
    );
  });

  it("Test 4 => pens and cancels the edit form", () => {
    renderCard();

    fireEvent.click(
      screen.getByRole("button", { name: /edit collection/i }),
    );

    expect(screen.getByDisplayValue("Favourites")).toBeInTheDocument();
    fireEvent.click(
      screen.getByRole("button", { name: /cancel editing collection/i }),
    );
    expect(screen.queryByDisplayValue("Favourites")).not.toBeInTheDocument();
  });

  it("Test 5 => Validates an empty title before updating", () => {
    const props = renderCard();

    fireEvent.click(
      screen.getByRole("button", { name: /edit collection/i }),
    );
    fireEvent.change(screen.getByDisplayValue("Favourites"), {
      target: { value: " " },
    });
    fireEvent.click(
      screen.getByRole("button", { name: /save collection changes/i }),
    );

    expect(props.onValidationError).toHaveBeenCalledWith(
      "Title cannot be empty!",
    );
    expect(updateCollection).not.toHaveBeenCalled();
  });

  it("Test 6 => Updates the collection title", async () => {
    const updatedCollection = {
      id_collection: 10,
      title: "Masterpieces",
      art_count: 2,
    };
    updateCollection.mockResolvedValue(updatedCollection);
    const props = renderCard();

    fireEvent.click(
      screen.getByRole("button", { name: /edit collection/i }),
    );
    fireEvent.change(screen.getByDisplayValue("Favourites"), {
      target: { value: "Masterpieces" },
    });
    fireEvent.click(
      screen.getByRole("button", { name: /save collection changes/i }),
    );

    await waitFor(() => {
      expect(updateCollection).toHaveBeenCalledWith(10, {
        title: "Masterpieces",
      });
      expect(props.setListCollections).toHaveBeenCalled();
    });

    const updateState = props.setListCollections.mock.calls[0][0];
    expect(updateState([collection])).toEqual([updatedCollection]);
  });

  it("Test 7 => Updates the visible title when the API only returns the title", async () => {
    updateCollection.mockResolvedValue({ title: "Masterpieces" });
    const props = renderCard();

    fireEvent.click(
      screen.getByRole("button", { name: /edit collection/i }),
    );
    fireEvent.change(screen.getByDisplayValue("Favourites"), {
      target: { value: "Masterpieces" },
    });
    fireEvent.click(
      screen.getByRole("button", { name: /save collection changes/i }),
    );

    await waitFor(() => {
      expect(props.setListCollections).toHaveBeenCalled();
    });

    const updateState = props.setListCollections.mock.calls[0][0];
    expect(updateState([collection])).toEqual([
      { ...collection, title: "Masterpieces" },
    ]);
  });

  it("Test 8 => Deletes the collection", async () => {
    deleteCollection.mockResolvedValue("201");
    const props = renderCard();

    fireEvent.click(
      screen.getByRole("button", { name: /delete collection/i }),
    );

    await waitFor(() => {
      expect(deleteCollection).toHaveBeenCalledWith(10);
      expect(props.setListCollections).toHaveBeenCalled();
    });

    const updateState = props.setListCollections.mock.calls[0][0];
    expect(
      updateState([collection, { id_collection: 20, title: "Modern Art" }]),
    ).toEqual([{ id_collection: 20, title: "Modern Art" }]);
  });
});
