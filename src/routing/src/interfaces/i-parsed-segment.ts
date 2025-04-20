import { SegmentKind } from "../models/segment-kind.js";

export interface IParsedSegment {
    kind: SegmentKind;
    raw: string;
    name?: string;
}