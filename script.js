var fbRef = firebase.database();
$(document).ready(function() {
    retrieveData();
});
//---------------------------------- CLEAR INPUT AREA (CANCEL BUTTON) ----------------------------------
function cancel(){
    $('#studentName').val('');
    $('#course').val('');
    $('#studentGrade').val('');
}
//---------------------------------- ADD INPUT VALUE TO TABLE (ADD BUTTON) ----------------------------------
var studentArr = [];
var studentObj = {};
function add() {
    studentObj = {
        name: $('#studentName').val(),
        course: $('#course').val(),
        grade : $('#studentGrade').val(),
        key : null
    };
    studentArr.push(studentObj);
    sendData(studentObj);
    cancel();
    calculateAverage();
}
//---------------------------------- SEND DATA TO FIREBASE ----------------------------------
function sendData(studentObj){
    var dataToSend = {
        name : studentObj.name,
        course: studentObj.course,
        grade : studentObj.grade,
        key : null
    };
    fbRef.ref('students').push(dataToSend);
    retrieveData();
}
//---------------------------------- RETRIEVE DATA FROM FIREBASE ----------------------------------
function retrieveData(){
    fbRef.ref('students').on('value', function (snapshot) {
        addDataToDom(snapshot.val());
    });
}
//---------------------------------- POST FIREBASE DATA TO THE TABLE ----------------------------------
function addDataToDom(firebaseObj){
    $('tbody').empty();
    var x;
    var key = Object.keys(firebaseObj);
    for(x in firebaseObj){
        var row = $('<tr>');
        var nameTd = $('<td>').append(firebaseObj[x].name);
        var courseTd = $('<td>').append(firebaseObj[x].course);
        var gradeTd = $('<td>').append(firebaseObj[x].grade);
        var editBtn = $('<button>').html('Edit').addClass('btn btn-primary btn-sm editBtn').click(openEditInput).css("margin-right", "3%").val(key[0]);
        var deleteBtn = $('<button>').html('Delete').addClass('btn btn-danger btn-sm').click(deleteStudent).val(key[0]);
        key.splice(0,1);
        var buttons = $('<td>').append(editBtn, deleteBtn);
        row.append(nameTd,courseTd,gradeTd,buttons);
        $('tbody').append(row);
    }
    calculateAverage();
}
//---------------------------------- CALCULATE AVERAGE GRADE ----------------------------------
function calculateAverage(){
    var grade = 0;
    for(var i = 0; i<$('tbody')[0].childElementCount; i++){
        var eachGrade = parseInt($('tbody')[0].children[i].children[2].innerText);
        grade += eachGrade;
    }
    var averageGrade = Math.round(grade/($('tbody')[0].childElementCount));
    if(isNaN(averageGrade)){
        $('.avgGrade').text('');                     //don't display anything if all rows are deleted
    }else{
        $('.avgGrade').text(averageGrade);
    }
}
//---------------------------------- DELETE THE SELECT ROW WHEN BUTTON CLICKED (DELETE BUTTON) ----------------------------------
function deleteStudent(){
    $('.editBtn').prop('disabled', false);
    fbRef.ref('students/' + $(this).val()).remove();
    calculateAverage();
}
//---------------------------------- EDIT THE INFORMATION ON SELECT ROW WHEN BUTTON CLICKED (EDIT BUTTON) ----------------------------------
function openEditInput(){
    $('.editBtn').prop('disabled', true);
    var key = $(this).val();
    var operations = $(this)[0].parentNode;
    var grade = $(this)[0].parentNode.previousSibling;
    var gradeValue = $(this)[0].parentNode.previousSibling.innerHTML;
    var course = $(this)[0].parentNode.previousSibling.previousSibling;
    var courseValue = $(this)[0].parentNode.previousSibling.previousSibling.innerHTML;
    var name = $(this)[0].parentNode.previousSibling.previousSibling.previousSibling;
    var nameValue = $(this)[0].parentNode.previousSibling.previousSibling.previousSibling.innerHTML;
    $(operations).append($('<button>').addClass("btn btn-default btn-sm saveBtn").css({"width" : "67%", "margin-top":"3%"}).html('Save'));
    grade.innerHTML = '';
    $(grade).append($('<input>').addClass("form-control gradeInput").val(gradeValue));
    course.innerHTML = '';
    $(course).append($('<input>').addClass("form-control courseInput").val(courseValue));
    name.innerHTML = '';
    $(name).append($('<input>').addClass("form-control nameInput").val(nameValue));
    $('.saveBtn').click(saveClicked);
    function saveClicked() {
        $('.editBtn').prop('disabled', false);
        $(this).hide();
        gradeValue = $('.gradeInput').val();
        $(grade).empty();
        grade.innerHTML = gradeValue;
        courseValue = $('.courseInput').val();
        $(course).empty();
        course.innerHTML = courseValue;
        nameValue = $('.nameInput').val();
        $(name).empty();
        name.innerHTML = nameValue;
        updateFB(gradeValue,courseValue,nameValue,key);
        calculateAverage();
    }
}
//---------------------------------- UPDATE FIREBASE WITH EDITED INFORMATION ----------------------------------
function updateFB(gradeValue,courseValue,nameValue,key){
    fbRef.ref('students/' + key).update({
        name: nameValue,
        course: courseValue,
        grade: gradeValue
    });
}