/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import { api, type RouterOutputs } from "~/utils/api";
import { NoteEditor } from "./NoteEditor";
import { NoteCard } from "./NoteCard";

const Content = () => {
  type Topic = RouterOutputs["topics"]["getAll"][0];

  const { data: sessionData } = useSession();

  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);

  const { data: topics, refetch: refetchTopics } = api.topics.getAll.useQuery(
    undefined, //no input
    {
      enabled: sessionData?.user !== undefined,
      onSuccess: (data) => {
        setSelectedTopic(selectedTopic ?? data[0] ?? null);
      },
    }
  );
  const createTopic = api.topics.create.useMutation({
    onSuccess: () => {
      void refetchTopics();
    },
  });

  const { data: notes, refetch: refetchNotes } = api.note.getAll.useQuery(
    {
      topicId: selectedTopic?.id ?? "",
    },
    {
      enabled: sessionData?.user !== undefined && selectedTopic !== null,
    }
  );
  const createNote = api.note.create.useMutation({
    onSuccess: () => {
      void refetchNotes();
    },
  });
  const deleteNote = api.note.delete.useMutation({
    onSuccess: () => {
      void refetchNotes();
    },
  });

  return (
    <div className="grid grid-cols-4 gap-2">
      <div className="bg-base-200 px-2">
        <ul className="menu rounded-box w-56  p-2">
          {topics?.map((topic) => (
            <li key={topic.id}>
              <a
                href="#"
                onClick={(event) => {
                  event.preventDefault();
                  setSelectedTopic(topic);
                }}
              >
                <span>{topic.title}</span>
              </a>
            </li>
          ))}
        </ul>
        <input
          type="text"
          placeholder="New Topic...."
          className="input-bordered input input-sm h-16 w-full"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              createTopic.mutate({ title: e.currentTarget.value });
              e.currentTarget.value = "";
            }
          }}
        />
      </div>
      <div className="col-span-3">
        <div>
          {notes?.map((note) => (
            <div key={note.id}>
              <NoteCard
                note={note}
                onDelete={() => void deleteNote.mutate({ id: note.id })}
              />
            </div>
          ))}
        </div>
        <NoteEditor
          onSave={({ title, content }) => {
            void createNote.mutate({
              title,
              content,
              topicId: selectedTopic?.id ?? "",
            });
          }}
        />
      </div>
    </div>
  );
};

export default Content;
