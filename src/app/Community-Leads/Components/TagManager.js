import { PlusCircleIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import Tag from "./Tag";

const TagsManager = ({ initialTags, onTagsChanged }) => {
  const [tags, setTags] = useState(initialTags);
  const [firstRun, setFirstRun] = useState(true);

  useEffect(() => {
    if (firstRun) {
      setFirstRun(false);
      return;
    }

    const updatedTags = tags
      .filter((tag) => !tag.isDeleted)
      .map((tag) => {
        if (tag.isNew) {
          const { isNew, ...restOfTag } = tag;
          return restOfTag;
        }
        return tag;
      });

    if (
      !tags.some((t) => t.isFresh) &&
      JSON.stringify(updatedTags) !== JSON.stringify(tags)
    )
      onTagsChanged(updatedTags);
  }, [tags]);

  const toggleDeleted = (index, value) => {
    const updatedTags = [...tags];
    updatedTags[index] = {
      ...updatedTags[index],
      isDeleted: value,
    };

    setTags(updatedTags);
  };

  const onTagUpdate = (newText, index) => {
    const newTags = [...tags];
    const { isFresh, ...newTag } = newTags[index];
    newTags[index] = { ...newTag, Tag: newText.trim() };
    setTags(newTags);
  };

  const handleAddTag = (e) => {
    e.stopPropagation();
    const newTag = { Tag: "New", isNew: true, isFresh: true };
    setTags((prevTags) => [...prevTags, newTag]);
  };

  return (
    <>
      <PlusCircleIcon
        className="inline size-5 text-miles-500 hover:text-miles-400 cursor-pointer"
        onClick={handleAddTag}
      />
      <div className="flex flex-wrap items-center gap-1">
        {tags?.length > 0 &&
          tags.map((tag, index) => (
            <Tag
              key={index}
              tag={tag}
              onChange={(innerText) => onTagUpdate(innerText, index)}
              onDelete={(v) => toggleDeleted(index, v)}
            />
          ))}
      </div>
    </>
  );
};

export default TagsManager;
