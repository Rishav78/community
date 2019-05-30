function switchState(e){
	$.confirm({
	  title: e,
	  content: "Do you really want switch state...",
	  boxWidth: '350px',
	  useBootstrap: false,
	  buttons: {
	      'Yes': {
	          btnClass: 'btn-success',
	          action: function () {
	            window.location.replace("/switchAsUser");
	          }
	      },
	      'No': {btnClass: 'btn-danger',}
	  }
	});
}