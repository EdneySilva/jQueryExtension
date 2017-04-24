//Chamada no HTML
<button id="btnSaveNewUser" type="submit" class="btn btn-success" data-url="/User/Create" data-error="" data-parameters="getFromForm('form[name=frm-newUser]');" >Cadastrar</button>

//javascript
(function ($) {
    $.fn.extend({
        ajaxClick: function (configureAjaxResponse) {
            $(this).each(function (index) {
                var _ajax = new ajaxObject(this);
                $(this).click(function (e) {
                    e.preventDefault();
                    var response = new ajaxResponse();
                    configureAjaxResponse.call(this, response);
                    _ajax.data = _ajax.parameters();                    
                    $.ajax({
                        type: _ajax.type,
                        cache: _ajax.cache,
                        dataType: _ajax.dataType,
                        url: _ajax.url,
                        data: _ajax.data,
                    }).success(function (e) {
                        _ajax.end(e, response);
                    }).error(function (e) {
                        console.log(e);
                        response.trigger("error", createResponse(1, "Ocorreu um erro no lado do servidor"));
                    }).complete(function (e) {
                        response.trigger("complete", e);
                    });
                    
                    return false;
                });
            });
        }
    })

    function ajaxObject(context) {
        var noop = Function();
        this.type = "POST";
        this.cache = false;
        this.dataType = "json";
        this.url = "";
        this.parameters = function () { return {}; };
        this.data = {};
        for (var i in this) {
            if (!$(context).data(i.toLowerCase()))
                continue;
            if (i == "parameters")
                this.parameters = eval("(function getParameters() { return " + $(context).data(i) + "})");
            else
                this[i] = $(context).data(i.toLowerCase());
        }

        this.html = function (ajax, html, response) {
            var _ajax = ajax;
            try {
                if (html)
                    response.trigger("success", html);
            } catch (ex) {
                response.trigger("error", createResponse(1, ex.message));
                console.log(ex);
            }
        }

        this.json = function (ajax, serverData, response) {
            console.log(serverData);
            var _ajax = ajax;
            try {
                if (serverData.data.Response === 0)
                    response.trigger("success", serverData);
                else
                    response.trigger("error", serverData);
            } catch (ex) {
                response.trigger("error", createResponse(1, ex.message));
                console.log(ex);
            }
        }

        this.end = function (serverData, response) {
            var func = this.getFunctionDataType(this.dataType);
            var ajaxObj = this;
            this.tryExecute(func, ajaxObj, serverData, response);
        }

        this.getFunctionDataType = function (dataType) {
            return this[dataType];
        }

        this.tryExecute = function (func, ajaxObj, serverData, response) {
            try{
                (func || noop)(ajaxObj, serverData, response);
            } catch (ex) {
                console.log(ex);
            }
        }

        return this;
    }

    function ajaxResponse() {
        var noop = Function();
        var context = this;
        context._oncomplete = Function();
        context._onsuccess = Function();
        context._onerror = Function();
        this.complete = function (callback) {
            context._oncomplete = callback;
        };
        this.success = function (callback) {
            context._onsuccess = callback;
            return this;
        };
        this.error = function (callback) {
            context._onerror = callback;
            return this;
        }

        this.trigger = function (name, parameters) {
            (context["_on" + name] || noop)(parameters);
            return this;
        }

        return {
            trigger: context.trigger,
            complete: context.complete,
            success: context.success,
            error: context.error
        };
    }
    
    function createResponse(response, message) {
        return {
            data: {
                Response: response,
                Message: message
            }
        }
    }
})($);

function getFromForm(selector) {
    return ($(selector) || {}).serialize();
}

function showSuccess(message) {
    $("#response-message").removeClass("alert-danger");
    $("#response-message").addClass("alert-success");
    show(message);
}

function showError(message) {
    $("#response-message").removeClass("alert-success");
    $("#response-message").addClass("alert-danger");
    show(message);
}

function show(message) {
    $("#response-message").show();
    $("#response-message span").html(message);
    setTimeout(function () {
        $("#response-message").hide();
    }, 5000);
}
function getFromId(a) {
    return $(a).data("id");
}
$(document).ready(function () {
    $("#response-message").hide();
    
    $("#btnSaveNewUser").ajaxClick(function (ajaxResponse) {
        var btn = this;
        $(btn).attr("disabled", "disabled");
        ajaxResponse.success(function (response) {
            showSuccess(response.data.Message);
        }).error(function (response) {
            showError(response.data.Message)
        }).complete(function () {
            $(btn).removeAttr("disabled");
        });
    });

    $(".edit").ajaxClick(function (ajaxResponse) {
        ajaxResponse.success(function (html) {
            $("#myModal").html(html);
            $("#myModal").modal();
        }).error(function (response) {
            showError(response.data.Message)
        });

    });
});
