var fbRef = firebase.database();
$(document).ready(function() {
    $('body').keyup(function(event){               //clear input area when 'esc' key pressed
        if(event.which === 27){
            cancel();
        }
    });
    $('body').keypress(function(event){               //add input value to table when 'enter' key pressed
        if(event.which === 13){
            add();
        }
    });
    retrieveData();
});
//---------------------------------- CLEAR INPUT AREA ----------------------------------
function cancel(){
    $('#studentName').val('');
    $('#course').val('');
    $('#studentGrade').val('');
}
//---------------------------------- ADD INPUT VALUE TO TABLE ----------------------------------
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
        var editBtn = $('<button>').html('Edit').addClass('btn btn-primary btn-sm').click(editStudent).css("margin-right", "3%");
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
//---------------------------------- DELETE THE SELECT ROW WHEN BUTTON CLICKED ----------------------------------
function deleteStudent(){
    fbRef.ref('students/' + $(this).val()).remove();
    calculateAverage();
}
//---------------------------------- EDIT THE INFORMATION ON SELECT ROW WHEN BUTTON CLICKED ----------------------------------
function editStudent(){
    console.log('edit');
    calculateAverage();
}


