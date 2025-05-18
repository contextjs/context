/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { SegmentKind } from "../models/segment-kind.js";

export interface IParsedSegment {
    kind: SegmentKind;
    raw: string;
    name?: string;
}