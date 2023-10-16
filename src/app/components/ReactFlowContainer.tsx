"use client";

import ELK from "elkjs";

import React, { useCallback, useState, useEffect } from "react";
import IconContainer from "./IconContainer";
import ReactFlow, {
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  Background,
  MiniMap,
  Controls,
  applyEdgeChanges,
  applyNodeChanges,
  Edge,
  Node
} from "reactflow";
import Modal from "./Modal";
import UploadFile from "@/app/components/UploadFile";
import { getReactFlowFromJson } from "@/utils/jsonToFlow";
import { ExcelConvertedJson } from "@/app/types/interface";
import { ToastContainer, toast } from "react-toastify";

import "reactflow/dist/style.css";

function convertReactFlowGraph2ELKGraph(array: any) {
// source: https://stackoverflow.com/questions/15376251/hierarchical-json-from-flat-with-parent-id
  const myMap: {[index: string]:any} = {}

  for(var i = 0; i < array.length; i++){
      var obj = array[i]
      
      // Add the iterator node to the structure
      if(!(obj.id in myMap)){
          myMap[obj.id] = obj
          myMap[obj.id].children = []
          myMap[obj.data] = obj.data
          myMap[obj.style] = obj.style
          myMap[obj.id].width = obj.width || 100
          myMap[obj.id].height = obj.height || 30
      }

      if(typeof myMap[obj.id].Name == 'undefined'){
        myMap[obj.id].id = obj.id
        myMap[obj.id].parentNode = obj.parentNode
      }

      var parentNode = obj.parentNode || '-';
      if(!(parentNode in myMap)){
        myMap[parentNode] = {}
        myMap[parentNode].children = []
      }

      // Register the node as a child to its parent
      myMap[parentNode].children.push(myMap[obj.id])
  }
  // return the node with no parent (= top hierarchy)
  return myMap["-"].children;
}

function convertELKGraph2ReactFlowGraph(array: any) {

  const nodes = array.reduce((result:any, current:any) => {
    result.push({
      id: current.id,
      position: { x: current.x, y: current.y },
      data: current.data,
      style: { width: current.width, height: current.height },
    });

    if (current.children) {
      current.children.forEach((child:any) =>
        result.push({
          id: child.id,
          position: { x: child.x, y: child.y },
          data: current.data,
          style: { width: child.width, height: child.height },
          parentNode: current.id,
          extent: "parent",
        })
      );
    }
    return result;
  }, []);

  return nodes;
}

const createLayout = async (formattedData: any) => {

  console.log("in createLayout");
  console.log(formattedData);

  const elk = new ELK();

  const graph = {
    id: "root",
    layoutOptions: {
      "elk.algorithm": "mrtree",
      "elk.direction": "DOWN"
    },
    children: convertReactFlowGraph2ELKGraph(formattedData.nodes),
    edges: formattedData.edges.map((edge: Edge) => ({
      id: edge.id,
      sources: [edge.source],
      targets: [edge.target],
    })),
  };

  const layout = await elk.layout(graph);


  return {
    nodes: convertELKGraph2ReactFlowGraph(layout.children),
    edges: layout.edges.map((edge: any) => ({
      id: edge.id,
      source: edge.sources[0],
      target: edge.targets[0]
    }))
  }
}

const ReactFlowContainer = () => {
  // @ts-ignore
  const [nodes, setNodes] = useNodesState<Node[]>([]);
  const [edges, setEdges] = useEdgesState<Edge[]>([]);

  const [isChildrenModelOpen, setChildrenModelIsOpen] = useState<boolean>(false);
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

  //Activated when Sample data is used
  useEffect(() => {
    console.log("in useEffect 2");
    
    if (jsonFormattedData.nodes.length === 0) return;

      console.log(jsonFormattedData);

      createLayout(jsonFormattedData).then((res) => {
        if (res) {
          setNodes(res.nodes);
          setEdges(res.edges);
        } else {
          toast.error("Someting went wrong.");
        }
      });
  }, [jsonFormattedData, setNodes, setEdges]);
  
  const closeModal = () => setChildrenModelIsOpen(false);
  const openModal = () => setChildrenModelIsOpen(true);

  const onNodesChange = useCallback(
    (changes: any) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );

  const onEdgesChange = useCallback(
    (changes: any) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
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
        fitView
      >
        <Controls />
        <MiniMap zoomable pannable />
        {/*// @ts-ignore*/}
        <Background variant="lines" gap={12} size={1} />
 
      </ReactFlow>
    </div>
  );
};

export default () => (
  <ReactFlowProvider>
    <ReactFlowContainer />
  </ReactFlowProvider>
);

