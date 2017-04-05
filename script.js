//---------------------------------- KEY PRESSED ----------------------------------
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
});
//---------------------------------- CLEAR INPUT AREA ----------------------------------
function cancel(){
    $('#studentName').val('');
    $('#course').val('');
    $('#studentGrade').val('');
}
//---------------------------------- ADD INPUT VALUE TO TABLE ----------------------------------
function add() {
    var row = $('<tr>');
    var name = $('<td>').append($('#studentName').val());
    var course = $('<td>').append($('#course').val());
    var grade = $('<td>').append($('#studentGrade').val());
    var button = $('<td>').append($('<button>').html('Delete').addClass('btn btn-danger btn-md').click(operations));
    row.append(name,course,grade,button);
    $('tbody').append(row);
    cancel();
    average();
}
//---------------------------------- DELETE THE SELECT ROW WHEN BUTTON CLICKED ----------------------------------
function operations(){
    $(this)[0].parentNode.parentNode.remove();
    average();
}
//---------------------------------- SHOWING AVERAGE SCORE ----------------------------------
function average(){
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