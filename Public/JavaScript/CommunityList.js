
var refresh = document.querySelector('.refresh')
var userType = document.querySelector('.CommunityRule')
var cross = document.querySelector('.cross')
var close = document.querySelector('.cls')
var edit = document.querySelector('.edit')
var s = document.querySelector('.editcover')

cross.onclick = cls
close.onclick = cls
s.onclick = cls
var child;

function cls(){
	edit.style.top = '-100%'
	edit.style.opacity = '0'
	console.log(s)
	s.style.display = 'none'
}
function Show(){
	edit.style.top = '50px'
	edit.style.opacity = '1'
	s.style.display = 'block'
}

$(document).ready(function(){
	var table = $('#myTable').DataTable({
		"lengthMenu": [[10, 25, 50], [ 10, 25, 50]],
		"serverSide": true,
        "processing": true,
		"ajax": {
	        url: '/community/communityList',
	        type: 'POST',
	        // "dataSrc": "",
	        // "data": function ( d ) {
	        //   d.roleFilter   = $('.Role').val();
	        //   d.statusFilter = $('.Status').val();
	        // },
	     },
	     "columns": [
            { title : "Community Name", "data": "CommunityName", 'sClass':'username'},
            { title : "Membership Rule", "data": "MembershipRule", 'sClass':'phone'},
            { title : "Community Location", "data": "CommunityLocation", 'sClass':'city'},
            { title : "Community Owner", "data": "CommunityOwner", 'sClass':'status'},
            { title : "Create Date", "data": "CreateDate", 'sClass':'role'},
            { title : "Action", "data": null, 'sClass':'active'},
            { title : "Community Pic", "data": "CommunityPic", 'sClass':'active'},
            // { title : "Community Pic","data": null, 'orderable' : false, 'sClass':'action'}
        ],
        // "fnRowCallback": function( nRow, aData, iDisplayIndex ) {
        // 	if(aData.Role === 'Superadmin'){
        // 		console.log(aData.Role)
        // 		$('td:eq(5)', nRow).html( '<div style="min-width: 100px;"><i onclick="nodeMailer(event)" class="fa fa-envelope-o icon"></i></div>' );
        // 	}else{
        // 		if(aData.ActivationState == 'True'){
	       //  		$('td:eq(5)', nRow).html( `<div style="min-width: 150px;"><i onclick="nodeMailer(event)" class="fa fa-envelope-o icon"></i><a data-toggle="modal" data-target="#editModal"><i onclick="showUpdateBox(event)" class="fa fa-edit icon"></i></a><i onclick="switchRole(event,'Deactivate User?')" class="fa fa-times-circle icon"></i></div>` );
	       //  	}else{
	       //  		$('td:eq(5)', nRow).html( `<div style="min-width: 150px;"><i onclick="nodeMailer(event)" class="fa fa-envelope-o icon"></i><a data-toggle="modal" data-target="#editModal"><i onclick="showUpdateBox(event)" class="fa fa-edit icon"></i></a><i onclick="switchRole(event,'Activate User?')" class="fa fa-check-circle icon"></i></div>`);
	       //  	}
        // 	}
        // }
	});
	// $('.Status').on('change', function () {
	//     table.ajax.reload(null, false);
	// });
	// $('.Role').on('change', function () {
	//     table.ajax.reload(null, false);
	// });
	// $('.refresh').on('click', function () {
	//     table.ajax.reload(null, false);
	// });
})

