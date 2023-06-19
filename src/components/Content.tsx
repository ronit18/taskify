/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import { api, type RouterOutputs } from "~/utils/api";

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
  return (
    <div className="mx-5 mt-5 grid grid-cols-4 gap-2">
      <div className="px-2">
        <ul className="menu rounded-box w-56 bg-base-100 p-2">
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
          className="input-bordered input input-sm w-full"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              createTopic.mutate({ title: e.currentTarget.value });
              e.currentTarget.value = "";
            }
          }}
        />
      </div>
      <div className="col-span-3"></div>
    </div>
  );
};

export default Content;
