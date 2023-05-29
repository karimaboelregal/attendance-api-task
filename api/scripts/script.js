// function renderHello() {
//     const template = document.getElementById('template').innerHTML;
//     const rendered = Mustache.render(template, { image: 'https://upload.wikimedia.org/wikipedia/en/thumb/b/ba/Flag_of_Germany.svg/1200px-Flag_of_Germany.svg.png', active: "active" });
//     document.getElementById('target').innerHTML = rendered;
// }
// renderHello();

//https://newsapi.org/sources

var eventsMediator = {
    events: {},
    on: function (eventName, callbackfn) {
        this.events[eventName] = this.events[eventName]
            ? this.events[eventName]
            : [];
        this.events[eventName].push(callbackfn);
    },
    emit: function (eventName, data) {
        if (this.events[eventName]) {
            this.events[eventName].forEach(function (callBackfn) {
                callBackfn(data);
            });
        }
    },
};


model = {

    data: [
        { "Country name": "Germany", "short": "GR", "img": "https://upload.wikimedia.org/wikipedia/en/thumb/b/ba/Flag_of_Germany.svg/1200px-Flag_of_Germany.svg.png" },
        { "Country name": "France", "short": "FR", "img": "https://cdn.britannica.com/82/682-050-8AA3D6A6/Flag-France.jpg" },
        { "Country name": "Belgium", "short": "BG", "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/Flag_of_Belgium.svg/692px-Flag_of_Belgium.svg.png" },
        { "Country name": "Netherlands", "short": "NL", "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Flag_of_the_Netherlands.svg/2560px-Flag_of_the_Netherlands.svg.png" },
    ],


    getData: function (short) {
        $.ajax({
            url: "https://newsapi.org/v2/top-headlines?country=" + short + "&apiKey=96db1ab781ed4bfb97428d6157ef4b86",
            method: "GET",
            error: function () {
            },
            success: function (data) {
                controller.sendArticles(data["articles"]);
            }
        });
    },


    findIndexByImage: function(img) {
        let elm = ""
        this.data.forEach((element) => {
            if (element["img"] == img) {
                elm = element;
            }
        });
        return elm;
    },

};


view = {

    render: function () {
        const template = document.getElementById('template').innerHTML;
        for (let i = 0; i < model.data.length; i++) {
            let rendered = Mustache.render(template, { image: model.data[i]["img"] });
            if (i == 0) {
                rendered = Mustache.render(template, { image: model.data[i]["img"], active: "active" });
            }
            document.getElementById('target').innerHTML += rendered;
        }

        $("img").click(function () {
            eventsMediator.emit("checkbox.changed", this.src);
        });

    },


    clearArticles: function() {
        document.getElementById('article-parent').innerHTML = "";

    },

    addArticle: function(title, author, desc) {
        const template = document.getElementById('article-template').innerHTML;
        let rendered = Mustache.render(template, { title: title, author: author, desc: desc });
        document.getElementById('article-parent').innerHTML += rendered;
    }

}



controller = {
    init: function () {
        view.render();
        eventsMediator.on("checkbox.changed", function (img) {

            let element = model.findIndexByImage(img);
            model.getData(element["short"]);
            
        });

    },
    sendArticles: function (data) {
        view.clearArticles();
        data.forEach((element) => {
            view.addArticle(element["title"], element["author"], element["url"]);
        });
    }
}


controller.init();