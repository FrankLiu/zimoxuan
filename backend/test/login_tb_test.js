var logintb = require('./login_tb');

var ua = '018UW5TcyMNYQwiAiwQRHhBfEF8QXtHcklnMWc=|Um5OcktySXRKc0lwSndNciQ=|U2xMHDJ7G2AHYg8hAS8WLQMjDVEwVjpdI1l3IXc=|VGhXd1llXGVeY11kXmddYF1gV2pIc0x5RH5KdE1zT3BMdUF0QW85|VWldfS0QMAsyCCgTMx1wWWRbY1xyJHI=|VmNDbUMV|V2NDbUMV|WGRYeCgGZhtmH2VScVI2UT5fORtmD2gCawwuRSJHZAFsCWMOdVYyVTpbPR99HWAFYU9vQW85bw==|WWdHFyoKNxcrFSwYOA05ASEdIxgjAzkCNxcrFS4VNQ8wBVMF|WmZbe1UFOw4wDS16VGhRaFBuUG1QaldsVW0YJQc6BzoBOQY4BDwEPwI4BzIMMAw0Y01tUQcpfw==|W2dZeSkHWzpcMFcpU39Fa0tlOXo+Ei4aOgcnGjoFOgEveS8=|XGdHFzkXNwsxESwMMw40D1kP|XWZGFjgWNgoxES0NMg42D1kP|XmVFFTsVNQ8xESkJNgg3DFoM|X2ZGFjh4LHQJYB18F1s8RyIMLBggGDgGOgEhGicdIXch|QHhYCCZ5ImQwSSBaIF45Qi56RmhIGCwXKQk3CjZgQH1dc119Rn9CdyF3|QXtbCyV6IWczSiNZI106QS15RWtLd1dsVWpUAlQ=|QnpaCiRkMGgUfht6B18iSzZXPBIyYlZoUnJMeUEXNwoqBCoKPwQ+AVcB|Q3lZCSd4I2UxSCFbIV84Qy97R2lJdFRhWmBYDlg=|RH5eDiBgNGwQeh9+A1smTzJTOBY2CiofJB4qfCo=|RXxBfFxhQX5eYltnR3lBe1tjV3dNdVVpVWxMcFBkWHhEfEhoV29PcElpVmhId1drVnZIdlZjQ31BYV9iNA==';
var userName = "占城相送:u4";
var password2 = "8c2ea3bec0c25fa14c23e94c6334e7082e9e36ec1e7719da07c19851298a98b678d59b74faf51ac8aeccab30e702e043eea6567ebebb7f81f8e14015726ad15893023ca35027c5307748c0122bb93f9ae0aea63b7082f870c3e25de3a97c351304dfa36afb5df969f3efebdbeb8d8b1755ae395cebcae0be5060dc9fd665620b";
logintb(userName, password2, function(err, resp){
	if(err) console.log(err);
	console.log(resp.cookies);
	console.log("=====================body===================");
	// console.log(resp.content);
});