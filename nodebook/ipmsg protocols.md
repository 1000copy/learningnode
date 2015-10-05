ipmsg :== header + ":"+content
header :== version + ":" + packet_no +":"+logon_user +":" +host_name +":" + command 
content :== appendix +"\0"+submessage +"\0" +submessage2 +"\0" 


submessage :== appendix_option ::== {filename + "\a"}*
	 WHEN command is IPMSG_SENDMSG

subMessage2 ::== UN:{user name}\nHN:{host name}\nNN:{appendix}\nGN:{appendix option} WHEN command is IPMSG_BR_ENTRY,IPMSG_BR_ABSENCE


appendix :== logonUser+"\a"+hostname +"\a"+ (2)+"\a"
   addr +"\a"+port +"\a"+username +"\a"+groupname 
when command is IPMSG_ANSLIST
appendix :== username
when command is
	case IPMSG_BR_ENTRY:
	case IPMSG_ANSENTRY:
	case IPMSG_BR_ABSENCE:

appendixOptions :== groupname
when command is
	case IPMSG_BR_ENTRY:
	case IPMSG_ANSENTRY:
	case IPMSG_BR_ABSENCE: