import { ServerView } from "@contextjs/views";

export default class Index extends ServerView {
    public static metadata = { filePath: "index.tshtml" };

    public async renderAsync(model): Promise<string> {
        this.writeLiteral("<div class=\\\"greeting\\\"></div>");

        return this.getOutput();
    }
}