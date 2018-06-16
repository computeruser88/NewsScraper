$(document).ready(function () {
    const articleContainer = $(".article-container");
    $(document).on("click", ".btn.delete", handleArticleDelete);
    $(document).on("click", ".btn.notes", handleArticleNotes);
    $(document).on("click", ".btn.note-save", handleNoteSave);
    $(document).on("click", ".btn.note-delete", handleNoteDelete);

    initializePage();

    const initializePage = () => {
        articleContainer.empty();
        $.get("/api/headlines?saved=true").then(function (data) {
            if (data && data.length) {
                renderArticles(data);
            } else {
                renderEmpty();
            }
        });
    }

    const renderArticles = (articles) => {
        let articlePanels = [];
        for (let i = 0; i < articles.length; i++) {
            articlePanels.push(createPanel(articles[i]));
        }
        articleContainer.append(articlePanels);
    }

    const createPanel = (article) => {
        const panel =
            $(["<div> class='panel panel-default'>",
                "<div class='panel-heading'>",
                "<h3>",
                article.title,
                "<a class='btn btn-info notes'>Article notes</a>",
                "</h3>",
                "</div>",
                "<div class='panel-body'>",
                article.summary,
                "</div></div>"
            ].join(""));
        panel.data("_id", article._id);
        return panel;
    }

    const renderEmpty = () => {
        const emptyAlert = $([
            "div class='alert alert-warning text-center'>",
            "<h4>No saved articles.</h4>",
            "</div>",
            "<div class='panel panel-default'>",
            "<div class='panel-heading text-center'>",
            "<h3>Click below to browse available articles.</h3>",
            "<h4><a href='/'>Browse articles</a></h4>",
            "</div></div>"].join(""));
        articleContainer.append(emptyAlert);
    }

    const renderNotesList = (data) => {
        let notesToRender = [];
        let currentNote;
        if (!data.notes.length) {
            currentNote = [
                "<li class='list-group-item'>",
                "There are no notes for this article yet.",
                "</li>"
            ].join("");
            notesToRender.push(currentNote);
        } else {
            for (let i = 0; i < data.notes.length; i++) {
                currentNote = $([
                    "<li class='list-group-item note'>",
                    data.notes[i].noteText,
                    "<button class='btn btn-danger note-delete'>x</button>",
                    "</li>"
                ].join(""));
                currentNote.children("button").data("_id", data.notes[i]._id);
                notesToRender.push(currentNote);
            }
        }
        $(".note-container").append(notesToRender);
    }

    const handleArticleDelete = () => {
        const articleToDelete = $(this).parents(".panel").data();
        $.ajax({
            method: "DELETE",
            url: "/api/headlines" + articleToDelete._id
        }).then(function (data) {
            if (data.ok) {
                initializePage();
            }
        });
    }

    const handleArticleNotes = () => {
        const currentArticle = $(this).parents(".panel").data();
        $.get("/api/notes/" + currentArticle._id).then(function (data) {
            const modalText = [
                "<div class='container-fluid text-center'>",
                "<h4>Notes for article: ",
                currentArticle._id,
                "</h4>",
                "<hr />",
                "<ul class='list-group note-container'>",
                "</ul>",
                "<textarea placeholder='New note' rows='4' cols='60'></textarea>",
                "<button class='btn btn-success save'>Save note</button>",
                "</div>"
            ].join("");
            bootbox.dialog({
                message: modalText,
                closeButton: true
            });
            const noteData = {
                _id: currentArticle._id,
                notes: data || []
            };
            $(".btn.save").data("article", noteData);
            renderNotesList(noteData);
        });
    }

    const handleNoteSave = () => {
        let noteData;
        const newNote = $(".bootbox-body textarea").val().trim();
        if (newNote) {
            noteData = {
                _id: $(this).data("article")._id,
                noteText: newNote
            };
            $.post("/api/notes", noteData).then(function () {
                bootbox.hideAll();
            });
        }
    }

    const handleNoteDelete = () => {
        const noteToDelete = $(this).data("_id");
        $.ajax({
            url: "/api/notes/" + noteToDelete,
            method: "DELETE"
        }).then(function () {
            bootbox.hideAll();
        });
    }
});