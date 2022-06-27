const config = require("./config");
const jointocreatemap = new Map();

module.exports = function (client) {

    client.on("voiceStateUpdate", (oldState, newState) => {
  let oldparentname = "unknown"
  let oldchannelname = "unknown"
  let oldchanelid = "unknown"
  if (oldState && oldState.channel && oldState.channel.parent && oldState.channel.parent.name) oldparentname = oldState.channel.parent.name
  if (oldState && oldState.channel && oldState.channel.name) oldchannelname = oldState.channel.name
  if (oldState && oldState.channelID) oldchanelid = oldState.channelID
  let newparentname = "unknown"
  let newchannelname = "unknown"
  let newchanelid = "unknown"
  if (newState && newState.channel && newState.channel.parent && newState.channel.parent.name) newparentname = newState.channel.parent.name
  if (newState && newState.channel && newState.channel.name) newchannelname = newState.channel.name
  if (newState && newState.channelID) newchanelid = newState.channelID
  if (oldState.channelID) {
      if (typeof oldState.channel.parent !== "undefined")  oldChannelName = `${oldparentname}\n\t**${oldchannelname}**\n*${oldchanelid}*`
       else  oldChannelName = `-\n\t**${oldparentname}**\n*${oldchanelid}*`
  }
  if (newState.channelID) {
      if (typeof newState.channel.parent !== "undefined") newChannelName = `${newparentname}\n\t**${newchannelname}**\n*${newchanelid}*`
      else newChannelName = `-\n\t**${newchannelname}**\n*${newchanelid}*`
  }

  if (!oldState.channelID && newState.channelID) {
    if(newState.channelID !== config.channelid) return;  
    jointocreatechannel(newState);  
  }

  if (oldState.channelID && !newState.channelID) {

          if (jointocreatemap.get(`tempvoicechannel_${oldState.guild.id}_${oldState.channelID}`)) {

            var vc = oldState.guild.channels.cache.get(jointocreatemap.get(`tempvoicechannel_${oldState.guild.id}_${oldState.channelID}`));

            if (vc.members.size < 1) { 

              jointocreatemap.delete(`tempvoicechannel_${oldState.guild.id}_${oldState.channelID}`); 

              console.log(" :: " + oldState.member.user.username + "#" + oldState.member.user.discriminator + " :: Room wurde gelöscht")

              return vc.delete(); 
          }
            else {
            }
          }
  }

  if (oldState.channelID && newState.channelID) {
  
    if (oldState.channelID !== newState.channelID) {

      if(newState.channelID===config.channelid) 

      jointocreatechannel(oldState);  

      if (jointocreatemap.get(`tempvoicechannel_${oldState.guild.id}_${oldState.channelID}`)) {

        var vc = oldState.guild.channels.cache.get(jointocreatemap.get(`tempvoicechannel_${oldState.guild.id}_${oldState.channelID}`));

        if (vc.members.size < 1) { 

          jointocreatemap.delete(`tempvoicechannel_${oldState.guild.id}_${oldState.channelID}`); 

          console.log(" :: " + oldState.member.user.username + "#" + oldState.member.user.discriminator + " Left the room")

          return vc.delete(); 
      }
      else {
      }
      }
    }
}
  })
    async function jointocreatechannel(user) {

      console.log(" :: " + user.member.user.username + "#" + user.member.user.discriminator + " Created a Room")

      await user.guild.channels.create(`${user.member.user.username}'s Room`, {
        type: 'voice',
        parent: user.channel.parent.id,
      }).then(async vc => {

        user.setChannel(vc);

        jointocreatemap.set(`tempvoicechannel_${vc.guild.id}_${vc.id}`, vc.id);

        await vc.overwritePermissions([
          {
            id: user.id,
            allow: ['MANAGE_CHANNELS'],
          },
          {
            id: user.guild.id,
            allow: ['VIEW_CHANNEL'],
          },
        ]);
      })
    }
}

//Coded by Tomato#6966!
