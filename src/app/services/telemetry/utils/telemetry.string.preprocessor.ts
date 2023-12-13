import { TelemetrySyncPreprocessor } from "../models/telemetry-sync-preprocessor";

export class TelemetryEntriesToStringPreprocessor implements TelemetrySyncPreprocessor {
    process(input: any): any {
        if (typeof input !== 'object') {
            throw new Error('TelemetryEntriesToStringPreprocessor expects input of type "object"');
        }

        return JSON.stringify(input);
    }
}
