// Use Lattice CSS so Storybook examples look correct
import "../src/css/LatticeLib.css";

export default {
  parameters: {
    layout: "padded",
    controls: { expanded: true },
    options: {
      storySort: (a, b) => {
        const normalize = (entry) => {
          if (Array.isArray(entry)) return entry[1] ?? entry[0] ?? {};
          return entry ?? {};
        };

        const aStory = normalize(a);
        const bStory = normalize(b);

        const aTitle = aStory.title ?? aStory.kind ?? "";
        const bTitle = bStory.title ?? bStory.kind ?? "";
        if (aTitle !== bTitle) return aTitle.localeCompare(bTitle);

        const aName = aStory.name ?? aStory.story ?? "";
        const bName = bStory.name ?? bStory.story ?? "";
        const aGroup = aName.split("/")[0] ?? "";
        const bGroup = bName.split("/")[0] ?? "";
        if (aGroup !== bGroup) return aGroup.localeCompare(bGroup);

        return aName.localeCompare(bName);
      },
    },
  },
};
