"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutation, useQuery } from "convex/react";
import { FormEvent, useState } from "react";
import { api } from "../../convex/_generated/api";
import { MessageList } from "@/Chat/MessageList";
import { Message } from "@/Chat/Message";

const convexSiteUrl = import.meta.env.VITE_CONVEX_SITE_URL;

export function Chat({ viewer }: { viewer: string }) {
  const [newMessageText, setNewMessageText] = useState("");
  const messages = useQuery(api.messages.list);
  const sendMessage = useMutation(api.messages.send);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    sendMessage({ body: newMessageText, author: viewer })
      .then(() => {
        setNewMessageText("");
      })
      .catch((error) => {
        console.error("Failed to send message:", error);
      });
  };

  const url = new URL(`${convexSiteUrl}/storage/get`);
  //url.searchParams.set("storageId", "kg2b2rnpnw2fg2naw4mx9ajwpd6yb4cg");
  url.searchParams.set("uuid", "902c3930-acc9-42bb-d11a-6d442cc69342");
  //const url = new URL(`${convexSiteUrl}/testouterget`);
  //url.searchParams.set("storageId", "kg2fndkmzfq97mh5j3b12nhyas6ybjky");

  return (
    <>
      <MessageList messages={messages}>
        {messages?.map((message) => (
          <Message key={message._id} author={message.author} viewer={viewer}>
            {message.body}
          </Message>
        ))}
      </MessageList>
      Hi there
      <img src={url.href} />
      <div className="border-t">
        <form onSubmit={handleSubmit} className="container flex gap-2 py-4">
          <Input
            value={newMessageText}
            onChange={(event) => setNewMessageText(event.target.value)}
            placeholder="Write a message…"
          />
          <Button type="submit" disabled={newMessageText === ""}>
            Send
          </Button>
        </form>
      </div>
    </>
  );
}
