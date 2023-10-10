import { Node, Edge } from "reactflow";

export const exampleJsonFormatted: {
  nodes: Node[];
  edges: Edge[];
} = {
  nodes: [
    {
      id: "Group 1",
      position: {
        x: 0,
        y: 200,
      },
      data: {
        label: "Groupe 1",
      },
      type: "Group",
      style: {
        width: 500,
        height: 120,
        backgroundColor: "rgba(240,240,240,0.25)",
      },
    },
    {
      id: "1",
      position: {
        x: 25,
        y: 50,
      },
      data: {
        label: "Node 1",
      },
      type: "",
      extent: "parent",
      parentNode: "Group 1",
      style: {
        backgroundColor: "rgba(255, 165, 0, 0.5)",
      },
    },
    {
      id: "2",
      position: {
        x: 190,
        y: 51,
      },
      data: {
        label: "Node 2",
      },
      type: "",
      extent: "parent",
      parentNode: "Group 1",
      style: {
        backgroundColor: "rgba(255, 165, 0, 0.5)",
      },
    },
    {
      id: "Group 2",
      position: {
        x: 185,
        y: 400,
      },
      data: {
        label: "Group 2",
      },
      type: "Group",
      style: {
        width: 200,
        height: 120,
        backgroundColor: "rgba(240,240,240,0.25)",
      },
    },
    {
      id: "3",
      position: {
        x: 25,
        y: 50,
      },
      data: {
        label: "Node 3",
      },
      type: "",
      extent: "parent",
      parentNode: "Group 2",
      style: {
        backgroundColor: "rgba(0, 128, 0, 0.5)",
      },
    },
    {
      id: "Group 3",
      position: {
        x: 0,
        y: -10,
      },
      data: {
        label: "Group 3",
      },
      type: "Group",
      style: {
        width: 200,
        height: 120,
        backgroundColor: "rgba(240,240,240,0.25)",
      },
    },
    {
      id: "4",
      position: {
        x: 25,
        y: 50,
      },
      data: {
        label: "Node 4",
      },
      type: "",
      extent: "parent",
      parentNode: "Group 3",
      style: {
        backgroundColor: "rgba(0, 0, 0, 0.5)",
      },
    },
  ],
  edges: [
    {
      id: "e1-2",
      source: "1",
      target: "2",
      animated: false,
      label: "Shared"
    },
    {
      id: "e4-1",
      source: "4",
      target: "1",
      animated: false,
        label: "Shared"
    },
    {
      id: "e2-3",
      source: "2",
      target: "3",
      animated: false,
        label: "Shared"
    }
  ],
};
