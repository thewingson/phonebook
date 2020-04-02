const URL_CONTACT = '/contact';

function parseContacts(message) {
    // $("#contacts").append("" + "<tr style='display: none'></tr>");
    var parsedJSON = JSON.parse(message);
    for (var i = 0; i < parsedJSON.length; i++) {
        var contact = {
            id: parsedJSON[i].id,
            name: parsedJSON[i].name,
            number: parsedJSON[i].number};
        addElement(contact);
    }
}
function getContacts(theUrl) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", theUrl, false);
    xmlHttp.send(null);
    return xmlHttp.responseText;
}

function setConnected(connected) {
    $("#connect").prop("disabled", connected);
    $("#disconnect").prop("disabled", !connected);
    if (connected) {
        $("#conversation").show();
    } else {
        $("#conversation").hide();
    }
    $("#contacts").html("");
}
function connect() {

    var contactResponse = getContacts(URL_CONTACT);

    var socket = new SockJS('/phonebook');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        setConnected(true);
        parseContacts(contactResponse);
        console.log('Connected: ' + frame);
        stompClient.subscribe('/topic/contact', function (message) {
            operationListener(JSON.parse(message.body));
        });
    });
}
function disconnect() {
    if (stompClient !== null) {
        stompClient.disconnect();
    }
    setConnected(false);
    console.log("Disconnected");
}

function operationListener(parsedJSON) {
    switch (parsedJSON.eventType) {
        case 'CREATE':
            addElement(parsedJSON.content);
            break;
        case 'UPDATE':
            updateElement(parsedJSON.content);
            break;
        case 'DELETE':
            deleteElement(parsedJSON.content.id);
            break;
        default:
            alert("No such case");
    }
}
function addElement(contact) {
    $("#contacts").append("" +
        "<tr>" +
        "<td>" + contact.id +
        "<input type='hidden' name=\"contactId\" value=\""+contact.id+"\">" +
        "</td>" +
        "<td>" + contact.name +
        "<input type='hidden' name=\"contactName\" value=\""+contact.name+"\">" +
        "</td>" +
        "<td>" + contact.number +
        "<input type='hidden' name=\"contactNumber\" value=\""+contact.number+"\">" +
        "</td>" +
        "<td>" +
        "<button class=\"btn btn-info\" onclick=\"updateButton(this)\">Edit</button>" +
        "<button class=\"btn btn-danger\" onclick=\"deleteButton(this)\">Delete</button>" +
        "</td>" +
        "</tr>");
}
function updateElement(contact) {
    $("#contacts tr").eq(contact.id-1).replaceWith("" +
        "<tr>" +
        "<td>" + contact.id +
        "<input type='hidden' name=\"contactId\" value=\""+contact.id+"\">" +
        "</td>" +
        "<td>" + contact.name +
        "<input type='hidden' name=\"contactName\" value=\""+contact.name+"\">" +
        "</td>" +
        "<td>" + contact.number +
        "<input type='hidden' name=\"contactNumber\" value=\""+contact.number+"\">" +
        "</td>" +
        "<td>" +
        "<button class=\"btn btn-info\" onclick=\"updateButton(this)\">Edit</button>" +
        "<button class=\"btn btn-danger\" onclick=\"deleteButton(this)\">Delete</button>" +
        "</td>" +
        "</tr>");
}
function deleteElement(id) {
    $("#contacts tr").eq(id-1).remove(0);
}

function addButton() {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("POST", URL_CONTACT, false);
    xmlHttp.setRequestHeader("Content-Type", "application/json");
    xmlHttp.send(JSON.stringify({'name': $("#addName").val(), 'number': $("#addNumber").val()}));

    $("#addForm #addName").val('');
    $("#addForm #addNumber").val('');
}
function updateButton(elem) {
    var contactId = $(elem).closest("tr").find("input[name='contactId']").val();
    var contactName = $(elem).closest("tr").find("input[name='contactName']").val();
    var contactNumber = $(elem).closest("tr").find("input[name='contactNumber']").val();

    $("#editDiv").css("display","block");
    $("#editForm #editId").val(contactId);
    $("#editForm #editName").val(contactName);
    $("#editForm #editNumber").val(contactNumber);
}
function deleteButton(elem) {
    var row = elem.parentNode.parentNode.rowIndex;
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("DELETE", URL_CONTACT + '/' + row, false); // false for synchronous request
    xmlHttp.send(null);
}
function cancelEdit() {
    $("#editForm #editId").val('');
    $("#editForm #editName").val('');
    $("#editForm #editNumber").val('');
    $("#editDiv").css("display","none");
}

function updateDo() {
    var contactId = $("#editForm #editId").val();
    var contactName = $("#editForm #editName").val();
    var contactNumber = $("#editForm #editNumber").val();

    $("#editForm #editId").val('');
    $("#editForm #editName").val('');
    $("#editForm #editNumber").val('');
    $("#editDiv").css("display","none");

    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("PUT", URL_CONTACT + '/' + contactId, false);
    xmlHttp.setRequestHeader("Content-Type", "application/json");
    xmlHttp.send(JSON.stringify({'name': contactName, 'number': contactNumber}));
}

$(function () {
    $("form").on('submit', function (e) {
        e.preventDefault();
    });
    $("#connect").click(function () {
        connect();
    });
    $("#disconnect").click(function () {
        disconnect();
    });
    $("#addButton").click(function () {
        addButton();
    });
    $("#cancelEdit").click(function () {
        cancelEdit();
    });
    $("#updateDo").click(function () {
        updateDo();
    });
});