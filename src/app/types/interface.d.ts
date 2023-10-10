import React from "react";
import { Edge, Node } from "reactflow";

export interface ModalProps {
  isOpen: boolean;
  closeModal: () => void;
  children: React.ReactNode;
}

export interface IconContainerProps {
  openModal: () => void;
  setChildrenModal: React.Dispatch<React.SetStateAction<React.ReactNode>>;
  setJsonData: React.Dispatch<React.SetStateAction<ExcelConvertedJson>>;
  closeModal: () => void;
  setJsonFormattedData: React.Dispatch<
    React.SetStateAction<{ nodes: Node[]; edges: Edge[] }>
  >;
  nodes: Node[];
  edges: Edge[];
}

export interface UploadFileProps {
  setJsonData: React.Dispatch<React.SetStateAction<ExcelConvertedJson>>;
  closeModal: () => void;
  setJsonFormattedData: React.Dispatch<
    React.SetStateAction<{ nodes: Node[]; edges: Edge[] }>
  >;
}

export interface UploadExcelFileProps {
  closeModal: () => void;
  setJsonData: React.Dispatch<React.SetStateAction<ExcelConvertedJson>>;
}

export interface UploadJsonFileProps {
  closeModal: () => void;
  setJsonFormattedData: React.Dispatch<
    React.SetStateAction<{ nodes: Node[]; edges: Edge[] }>
  >;
}

export interface DownloadFlowProps {
  nodes: Node[];
  edges: Edge[];
}

export type ColorType = "orange" | "green" | "black";

export interface ExcelConvertedJsonNode {
  "Node ID": number;
  "Node Group": string;
  "Node color": ColorType;
  "Node name": string;
}

export interface ExcelConvertedJsonEdge {
  NodeSource: number;
  NodeTarget: number;
  "Use case": string;
  Label: string;
}

export interface ExcelConvertedJson {
  nodes: ExcelConvertedJsonNode[];
  edges: excelConvertedJsonEdge[];
}
