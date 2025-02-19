import { User } from "./user";

export type XYPosition = {
  x: number;
  y: number;
};

export type CoordinateExtent = [[number, number], [number, number]];

type CSSStyle = {
  [key: string]: string | number | undefined;
};

export type NodeOrigin = [number, number];

export type NodeHandle = {
  x: number;
  y: number;
  position: Position;
  id?: string | null;
  width?: number;
  height?: number;
  type?: "source" | "target";
};

export type Node<
  NodeData extends Record<string, unknown> = Record<string, unknown>,
  NodeType extends string = string,
> = {
  id: string;
  position: XYPosition;
  data: NodeData;
  type?: NodeType;
  sourcePosition?: Position;
  targetPosition?: Position;
  hidden?: boolean;
  selected?: boolean;
  dragging?: boolean;
  draggable?: boolean;
  selectable?: boolean;
  connectable?: boolean;
  resizing?: boolean;
  deletable?: boolean;
  dragHandle?: string;
  width?: number | null;
  height?: number | null;
  parentId?: string;
  zIndex?: number;
  extent?: "parent" | CoordinateExtent;
  expandParent?: boolean;
  ariaLabel?: string;
  focusable?: boolean;
  style?: CSSStyle;
  className?: string;
  origin?: NodeOrigin;
  handles?: NodeHandle[];
  measured?: {
    width?: number;
    height?: number;
  };
};

enum Position {
  Left = "left",
  Top = "top",
  Right = "right",
  Bottom = "bottom",
}

export type FlowJSON = {
  id: string;
  position: {
    x: number;
    y: number;
  };
  data: Record<string, unknown>;
  type?: string;
  sourcePosition?: Position;
  targetPosition?: Position;
  hidden?: boolean;
  selected?: boolean;
  dragging?: boolean;
  draggable?: boolean;
  selectable?: boolean;
  connectable?: boolean;
  resizing?: boolean;
  deletable?: boolean;
  dragHandle?: string;
  width?: number | null;
  height?: number | null;
  parentId?: string;
  zIndex?: number;
  extent?: "parent" | [[number, number], [number, number]];
  expandParent?: boolean;
  ariaLabel?: string;
  focusable?: boolean;
  style?: CSSStyle;
  className?: string;
  origin?: [number, number];
  handles?: {
    x: number;
    y: number;
    position: Position;
    id?: string | null;
    width?: number;
    height?: number;
    type?: "source" | "target";
  }[];
  measured?: {
    width?: number;
    height?: number;
  };
};

export type Flow = {
  pid: string;
  id: string;
  owner: User;
  body: {
    nodes: any[];
    edges: any[];
    viewport: {
      x: number;
      y: number;
      zoom: number;
    };
  };
};

export enum PermissionLevel {
  VIEWER = 1,
  EDITOR = 2,
  OWNER = 3,
}
