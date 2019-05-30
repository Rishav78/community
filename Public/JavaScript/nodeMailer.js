function nodeMailer(event){
	var user = event.target.parentNode.parentNode.parentNode.firstElementChild.textContent.trim()
	var x = `<div class="Mcover"><div class="mailContainer"><div class="Mhead">Send Reminder Mail <span class="Mclose">&times</span></div><div class="form-group"><div class="Mleft">To:</div><div class="Mright"><input type="text" value="${user}" name="to" class="MtextBox to" disabled></div></div><div class="form-group"><div class="Mleft">Subject:</div><div class="Mright"><input type="text" name="subject" class="MtextBox subject" value="(This mail is from CQ)"></div></div><div class="Mdata"><textarea type="text" class="form-control" name="body" id="body"></textarea></div><div class="Msend"><button id="mailsend" onclick="sendMail(event)">send</button></div></div></div>`
	document.querySelector('.mailParent').innerHTML = x
	document.querySelector('.mailContainer').onclick = (event)=>{
		 event.cancelBubble = true;
	}
	document.querySelector('.Mclose').onclick = ()=>{
		document.querySelector('.mailContainer').classList.add('animatereverse')
	}
	document.querySelector('.Mcover').onclick = ()=>{
		document.querySelector('.mailContainer').classList.add('animatereverse')
	}
	$.trumbowyg.svgPath = '/aaa';
  	$('#body').trumbowyg();
  	document.querySelector('.mailContainer').classList.add('Manimate')
  	document.querySelector('.mailContainer').addEventListener('animationend',(event)=>{
  		console.log(event.animationName)
  		if(event.animationName == 'down_top'){
  			document.querySelector('.Mcover').removeChild(document.querySelector('.mailContainer'))
  			document.querySelector('.mailParent').removeChild(document.querySelector('.Mcover'))
  		}
  	})
}