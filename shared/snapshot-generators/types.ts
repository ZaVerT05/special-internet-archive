import { WriteStream } from "node:tty";

export type ObtainSnapshotTimes = (
  webPageUrl: string,
  aliasUrl?: string | undefined,
) => Promise<string[]>;

export interface SnapshotContext {
  relevantTimeMin?: string;
}

export type TakeSnapshot = (payload: {
  abortSignal?: AbortSignal;
  output?: WriteStream | undefined;
  snapshotContext?: SnapshotContext | undefined;
  webPageUrl: string;
}) => Promise<void | string>;

export type ParseSnapshot = (payload: {
  abortSignal?: AbortSignal;
  output?: WriteStream | undefined;
  snapshotFilePath: string;
}) => Promise<void | string>;

export type StopTakeSnapshotBatch = () => void | Promise<void>;
export type StopParseSnapshotBatch = () => void | Promise<void>;

export interface SnapshotGenerator {
  aliasesSupported: boolean;
  name: string;
  obtainSnapshotTimes: ObtainSnapshotTimes;
  parseSnapshot?: ParseSnapshot;
  snapshotAttemptTimeoutInSeconds: number;
  stopParseSnapshotBatch?: StopParseSnapshotBatch;
  stopTakeSnapshotBatch?: StopTakeSnapshotBatch;
  takeSnapshot: TakeSnapshot;
}
