const URL_CONTACT = '/contact';
const URL_PAGESIZE = '/pagesize';
const DEFAULT_PAGE_SIZE = '?page=0&size=3';

function parseContacts(message) {
    var parsedJSON = JSON.parse(message);
    for (var i = 0; i < parsedJSON.length; i++) {
        var contact = {
            id: parsedJSON[i].id,
            personName: parsedJSON[i].personName,
            phoneNumber: parsedJSON[i].phoneNumber};
        addElement(contact);
    }
}
function getContacts(theUrl, pageAndSize) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", theUrl + pageAndSize, false);
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

    var contactResponse = getContacts(URL_CONTACT, DEFAULT_PAGE_SIZE);

    var socket = new SockJS('/phonebook');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        setConnected(true);
        refreshPagination();
        parseContacts(contactResponse);
        console.log('Connected: ' + frame);
        stompClient.subscribe('/topic/contact', function (message) {
            refreshPagination();
            getPage(0);
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

function addElement(contact) {
    $("#contacts").append("" +
        "<tr>" +
        "<td>" + contact.id +
        "<input type='hidden' name=\"contactId\" value=\""+contact.id+"\">" +
        "</td>" +
        "<td>" + contact.personName +
        "<input type='hidden' name=\"contactName\" value=\""+contact.personName+"\">" +
        "</td>" +
        "<td>" + contact.phoneNumber +
        "<input type='hidden' name=\"contactNumber\" value=\""+contact.phoneNumber+"\">" +
        "</td>" +
        "<td>" +
        "<button class=\"btn btn-info\" onclick=\"updateButton(this)\">Edit</button>" +
        "<button class=\"btn btn-danger\" onclick=\"deleteButton(this)\">Delete</button>" +
        "</td>" +
        "</tr>");
}
function refreshPagination() {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", URL_CONTACT + URL_PAGESIZE, false);
    xmlHttp.send(null);
    var pages = xmlHttp.responseText;

    $("#pagination").empty();

    for (var i = 0; i < pages; i++) {
        $("#pagination").append("" +
            "<li class=\"page-item\"><a class=\"page-link\" onclick=\"getPage("+i+")\">"+i+"</a></li>"
        );
    }
}

function addButton() {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("POST", URL_CONTACT, false);
    xmlHttp.setRequestHeader("Content-Type", "application/json");
    xmlHttp.send(JSON.stringify({'personName': $("#addName").val(), 'phoneNumber': $("#addNumber").val()}));

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
    var index = $(elem).closest("tr").find("input[name='contactId']").val()
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("DELETE", URL_CONTACT + '/' + index, false); // false for synchronous request
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
    xmlHttp.send(JSON.stringify({'personName': contactName, 'phoneNumber': contactNumber}));
}
function getPage(page){
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", URL_CONTACT + "?page=" + page, false);
    xmlHttp.send(null);
    var contactResponse = xmlHttp.responseText;
    $("#contacts").empty();
    parseContacts(contactResponse);
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