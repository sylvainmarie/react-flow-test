"use client";

import ELK from "elkjs";

import React, { useCallback, useState, useEffect } from "react";
import IconContainer from "./IconContainer";
import ReactFlow, {
  useNodesState,
  useEdgesState,
  Background,
  addEdge,
  MiniMap,
  Controls,
  applyEdgeChanges,
  applyNodeChanges,
  Edge,
  Node,
  Panel,
} from "reactflow";
import Modal from "./Modal";
import UploadFile from "@/app/components/UploadFile";
import { getReactFlowFromJson } from "@/utils/jsonToFlow";
import { ExcelConvertedJson } from "@/app/types/interface";

import "reactflow/dist/style.css";
import { ToastContainer, toast } from "react-toastify";
import { Button, Select, SelectItem, Title } from "@tremor/react";
import { OutputJsonFromExcelToReactFlow } from "@/utils/jsonToFlow";

type NodeType = "Group" | "input" | "output" | "default" | "resizeRotate";

const getId = (nodesLength: number, type: NodeType) => {
  return type === "Group"
    ? `Group ${nodesLength + 1}`
    : `Node ${nodesLength + 1}`;
};

const createLayout = async (formattedData: OutputJsonFromExcelToReactFlow) => {
  const { formattedNodes, formattedEdges } = formattedData;

  const elk = new ELK();

  const groupNode = formattedNodes.filter((node: Node) => {
    return node.type === "Group";
  });
  const noneGroupNode = formattedNodes.filter((node: Node) => {
    return node.type !== "Group";
  });

  let graphChildren: any[] = [];
  groupNode.forEach((group: Node) => {
    let children: any[] = [];
    noneGroupNode.forEach((node: Node) => {
      if (node.parentNode === group.id) {
        children.push({
          id: node.id,
          width: node.style?.width || 150,
          height: node.style?.height || 50,
          layoutOptions: {
            "elk.direction": "DOWN",
          },
        });
      }
    });

    graphChildren.push({
      id: group.id,
      width: 500,
      height: 500,
      layoutOptions: {
        "elk.direction": "DOWN",
      },
      children: children,
    });
  });

  const graph = {
    id: "root",
    layoutOptions: {
      "elk.algorithm": "mrtree",
      "elk.direction": "DOWN",
    },
    children: graphChildren,
    edges: formattedEdges.map((edge: Edge) => ({
      id: edge.id,
      sources: [edge.source],
      targets: [edge.target],
    })),
  };

  console.log(graph);

  const layout = await elk.layout(graph);

  if (layout.children) {
    const nodes = layout.children.reduce((result, current) => {
      result.push({
        id: current.id,
        position: { x: current.x, y: current.y },
        data: { label: current.id },
        style: { width: current.width, height: current.height },
      } as never);

      if (current.children) {
        current.children.forEach((child) =>
          result.push({
            id: child.id,
            position: { x: child.x, y: child.y },
            data: { label: child.id },
            style: { width: child.width, height: child.height },
            parentNode: current.id,
          } as never)
        );
      }

      return result;
    }, []);

    return {
      nodes,
      edges: formattedEdges,
    };
  }
};
const ReactFlowContainer = () => {
  // @ts-ignore
  const [nodes, setNodes] = useNodesState<Node[]>([]);
  const [edges, setEdges] = useEdgesState<Edge[]>([]);
  const [isChildrenModelOpen, setChildrenModelIsOpen] =
    useState<boolean>(false);
  const [childrenModal, setChildrenModal] = useState<React.ReactNode>(null);
  const [jsonData, setJsonData] = useState<ExcelConvertedJson>({
    nodes: [],
    edges: [],
  });
  const [jsonFormattedData, setJsonFormattedData] = useState<{
    nodes: Node[];
    edges: Edge[];
  }>({
    nodes: [],
    edges: [],
  });

  useEffect(() => {
    if (nodes.length === 0) {
      setChildrenModelIsOpen(true);
      setChildrenModal(
        <UploadFile
          setJsonData={setJsonData}
          closeModal={closeModal}
          setJsonFormattedData={setJsonFormattedData}
        />
      );
    }
  }, [nodes]);

  /**
   * The above code snippet is a TypeScript React component that uses the useEffect hook to update the
   * nodes and edges state variables based on changes in the jsonData and jsonFormattedData variables.
   * It also defines functions for opening and closing a modal, and for handling node and edge changes.
   */
  //Activated when Excel is uploaded
  useEffect(() => {
    if (jsonData.nodes.length === 0) return;
    const formattedData = getReactFlowFromJson(jsonData);
    if (!formattedData) return;

    console.log(formattedData);

    createLayout(formattedData).then((res) => {
      if (res) {
        setNodes(res.nodes);
        setEdges(res.edges);
      } else {
        toast.error("Someting went wrong.");
      }
    });
  }, [jsonData, setNodes, setEdges]);

  useEffect(() => {
    setNodes(jsonFormattedData?.nodes);
    setEdges(jsonFormattedData?.edges);
  }, [jsonFormattedData, setNodes, setEdges]);
  const closeModal = () => setChildrenModelIsOpen(false);
  const openModal = () => setChildrenModelIsOpen(true);

  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodesChange = useCallback(
    (changes: any) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );
  const onEdgesChange = useCallback(
    (changes: any) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );

  const onAdd = useCallback(
    (type: NodeType) => {
      const newNodes = [...nodes];

      const newNode = {
        id: getId(nodes.length, type),
        data: { label: type === "Group" ? "" : getId(nodes.length, type) },
        type: type,
        position: {
          x: Math.random() * window.innerWidth - 500,
          y: Math.random() * window.innerHeight,
        },
        style: {},
      };

      if (type === "Group") {
        newNode.style = {
          backgroundColor: "rgba(240,240,240,0.25)",
          width: 300,
          height: 200,
          padding: 10,
        };
      }

      newNodes.push(newNode as Node);
      setNodes(newNodes);
    },
    [setNodes, nodes]
  );

  return (
    <div
      style={{ width: "100vw", height: "100vh" }}
      className="react-flow-container"
    >
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <IconContainer
        openModal={openModal}
        setChildrenModal={setChildrenModal}
        setJsonData={setJsonData}
        closeModal={closeModal}
        setJsonFormattedData={setJsonFormattedData}
        nodes={nodes}
        edges={edges}
      />
      <Modal isOpen={isChildrenModelOpen} closeModal={closeModal}>
        {childrenModal}
      </Modal>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <Controls />
        <MiniMap zoomable pannable />
        {/*// @ts-ignore*/}
        <Background variant="lines" gap={12} size={1} />
        <Panel position="top-left" className="flex items-center justify-center">
          <Select
            placeholder="Add node"
            onValueChange={(value) => onAdd(value as NodeType)}
          >
            <SelectItem value="default">Default Node</SelectItem>
            <SelectItem value="input">Input Node</SelectItem>
            <SelectItem value="output">Output Node</SelectItem>
            <SelectItem value="Group">Group</SelectItem>
          </Select>
          {nodes.length === 0 && (
            <Title color="red" className="w-[300px] pl-3">
              Please add data
            </Title>
          )}
        </Panel>
      </ReactFlow>
    </div>
  );
};

export default ReactFlowContainer;
