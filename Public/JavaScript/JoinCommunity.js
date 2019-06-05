document.querySelector('.textBox').onkeyup = removeCommunities


function removeCommunities(){
	while(document.querySelector('.available').childElementCount > 0){
		document.querySelector('.available').removeChild(document.querySelector('.available').firstElementChild)
	}
	displayCommunitys()
}

function  displayCommunitys() {
	var req = new XMLHttpRequest()
	req.onload = ()=>{
		var communities = JSON.parse(req.responseText)
		var notFound = `<div class="noCommunityFound"><h1>OOPS...!!!</h1><h3>Sorry for inconvienence. We didn't find any data.</h3></div>`
		if(communities.length == 0){
			document.querySelector('.available').innerHTML = notFound
		}else{
			communities.forEach((value) => {
				var div = document.createElement('div')
				div.classList.add('Ccontainer')
			  	if(value.MembershipRule != 'Direct'){
			  		div.innerHTML = `
						<div class="community">
							<div style="display: none;"> ${value.Id} </div>
							<div class="communityPic">
								<img src="/static/${value.CommunityPic}">
							</div>
							<div class="communityName">
								<a href="/community/communityprofile/${value.Id}">${value.CommunityName}</a>
							</div>
							<div class="join">
								<span onclick="joinReq(event)">
									Ask To Join
								</span>
							</div>
						</div>
						<h5>1 Members</h5>
						<div>${value.Discription}</div>
					`
					document.querySelector('.available').appendChild(div)
			  	}else{
			  		div.innerHTML = `
						<div class="community">
							<div style="display: none;"> ${value.Id} </div>
							<div class="communityPic">
								<img src="/static/${value.CommunityPic}">
							</div>
							<div class="communityName">
								<a href="/community/communityprofile/${value.Id}">${value.CommunityName}</a>
							</div>
							<div class="join">
								<span onclick="joinReq(event)">
									Join
								</span>
							</div>
						</div>
						<h5>1 Members</h5>
						<div>${value.Discription}</div>
					`
					document.querySelector('.available').appendChild(div)
			  	}
			})
		}
	}
	req.open('POST','/community/list')
	req.send(document.querySelector('.textBox').value)
}

function joinReq(event){
	var x = event.target.parentElement.parentElement
	var req = new XMLHttpRequest()
	req.onload = ()=>{
		$(x.parentElement).fadeOut(1000,()=>{
		x.parentElement.parentElement.removeChild(x.parentElement)
	});
	}
	req.open('GET',`/community/joinCommunity/${x.firstElementChild.textContent.trim()}`)
	req.send()
}

window.onload = displayCommunitys