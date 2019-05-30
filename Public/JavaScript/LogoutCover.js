function logout()
{
   $.confirm({
    title: 'Confirm Logout!',
    content: 'Do you really want logout?',
    theme: 'supervan',
    alignMiddle: false,
    buttons: {
       'Yes': {
           btnClass: 'btn-success',
           action: function(){
              window.location.replace("/logout");
            }
          },
        'No': {btnClass: 'btn-danger',}
      }
  });
}