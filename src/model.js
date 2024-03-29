import showMessage from "./message.js";
import randomSelection from "./utils.js";

let currentModel = 'https://cdn.jsdelivr.net/gh/imuncle/live2d@vlatest/model/HyperdimensionNeptunia/noireswim/index.json'

class Model {
    constructor(config) {
        let { apiPath, cdnPath } = config;
        let useCDN = false;
        if (typeof cdnPath === "string") {
            useCDN = true;
            if (!cdnPath.endsWith("/")) cdnPath += "/";
        } else if (typeof apiPath === "string") {
            if (!apiPath.endsWith("/")) apiPath += "/";
        } else {
            throw "Invalid initWidget argument!";
        }
        this.useCDN = useCDN;
        this.apiPath = apiPath;
        this.cdnPath = cdnPath;
    }

    async loadModelList() {
       await Promise.all([fetch('https://cdn.jsdelivr.net/gh/imuncle/live2d@vlatest/model/HyperdimensionNeptunia/noireswim/index.json'),
        fetch('https://cdn.jsdelivr.net/gh/imuncle/live2d@vlatest/model/HyperdimensionNeptunia/noir/index.json'),
        fetch('https://cdn.jsdelivr.net/gh/imuncle/live2d@vlatest/model/HyperdimensionNeptunia/noir_santa/index.json'),
        fetch('https://cdn.jsdelivr.net/gh/imuncle/live2d@vlatest/model/HyperdimensionNeptunia/noir_classic/index.json')
        ])
    }

    async loadModel(modelId, modelTexturesId, message) {
        localStorage.setItem("modelId", modelId);
        localStorage.setItem("modelTexturesId", modelTexturesId);
        showMessage(message, 4000, 10);
        loadlive2d("live2d", currentModel);
    }

    async loadRandModel() {
        const modelId = localStorage.getItem("modelId"),
            modelTexturesId = localStorage.getItem("modelTexturesId");
        if (this.useCDN) {
            if (!this.modelList) await this.loadModelList();
            const target = randomSelection(currentModel,['https://cdn.jsdelivr.net/gh/imuncle/live2d@vlatest/model/HyperdimensionNeptunia/noir/index.json','https://cdn.jsdelivr.net/gh/imuncle/live2d@vlatest/model/HyperdimensionNeptunia/noir_santa/index.json',`https://cdn.jsdelivr.net/gh/imuncle/live2d@vlatest/model/HyperdimensionNeptunia/noir_classic/index.json`,'https://cdn.jsdelivr.net/gh/imuncle/live2d@vlatest/model/HyperdimensionNeptunia/noireswim/index.json']);
            currentModel = target
            loadlive2d("live2d", currentModel);
            showMessage("我的新衣服好看嘛？", 4000, 10);
        } else {
            // 可选 "rand"(随机), "switch"(顺序)
            fetch(`${this.apiPath}rand_textures/?id=${modelId}-${modelTexturesId}`)
                .then(response => response.json())
                .then(result => {
                    if (result.textures.id === 1 && (modelTexturesId === 1 || modelTexturesId === 0)) showMessage("我还没有其他衣服呢！", 4000, 10);
                    else this.loadModel(modelId, result.textures.id, "我的新衣服好看嘛？");
                });
        }
    }

    async loadOtherModel() {
        let modelId = localStorage.getItem("modelId");
        if (this.useCDN) {
            if (!this.modelList) await this.loadModelList();
            const index = (++modelId >= this.modelList.models.length) ? 0 : modelId;
            this.loadModel(index, 0, this.modelList.messages[index]);
        } else {
            fetch(`${this.apiPath}switch/?id=${modelId}`)
                .then(response => response.json())
                .then(result => {
                    this.loadModel(result.model.id, 0, result.model.message);
                });
        }
    }
}

export default Model;
