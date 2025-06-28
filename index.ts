export default {
    async renderAsync(model) {
        let __out = "";
        __out += "\n";
        __out += "@Page Start@\n";
        let msg = "Hello from Views"; 
        __out += "<";
        __out += "div";
        __out += ">";
        __out += "\n    ";
        __out += "Hi ";
        __out += (msg);
        __out += "\n    ";
        __out += "<";
        __out += "ul";
        __out += ">";
        __out += "\n        ";
        for(let i=0;i<2;i++) {
            
        __out += "<";
        __out += "li";
        __out += ">";
        __out += (i);
        __out += "</";
        __out += "li";
        __out += ">";
        __out += "\n        ";
        } 
        __out += "</";
        __out += "ul";
        __out += ">";
        __out += "\n";
        __out += "</";
        __out += "div";
        __out += ">";
        __out += "\n";

        return __out;
    },
    metadata: { filePath: "index.tshtml" }
};