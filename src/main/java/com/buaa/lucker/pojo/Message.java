package com.buaa.lucker.pojo;

public class Message {
	int id;
	String subject;
	String content;
	int senderid;
	int recipientid;
	public int getId() {
        return id;
    }
    public void setId(int id ) {
        this.id = id;
    }
    public String getContent() {
        return content;
    }
    public void setContent(String content) {
        this.content = content;
    }
    public String getSubgect() {
        return subject;
    }
    public void setSubject(String subject) {
        this.subject = subject;
    }
    public int getSenderid()
    {
    	return senderid;
    }
    public void setWeight(int senderid)
    {
    	this.senderid=senderid;
    }
    public int getRecipientid()
    {
    	return recipientid;
    }
    public void setRecipientid(int recipientid)
    {
    	this.recipientid=recipientid;
    }
}
