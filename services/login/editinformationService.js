const users = require('../../models/user');

exports.updateInformation = async (req, res) => {
  const { _id } = req.user;
  console.log(req.body)
  const { name:Name, 
          dob:DOB, 
          gender:Gender, 
          phone:Phno, 
          city:City, 
          about:About, 
          expectations:Expectations } = req.body;
  console.log(Phno)
	await users.updateOne({ _id },{
		Name, DOB, Gender, Phno, City, About, Expectations, Verified: true,
	});
	return res.redirect('/profile')
}