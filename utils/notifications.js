import UserModel from "../models/user"
import profileModel from "../models/profile"
import PostModel from "../models/post"
import NotificationModel from "../models/notification"
import FollowersModel from "../models/followers"
import ErrorHandler from "./errorHandler";

export const setNotificationToUnread = async(userId,next)=>{

    try {
        const user = await UserModel.findById(userId);

        if(!user.unreadNotification){
            user.unreadNotification = true;
            await user.save();  
        }
        return;
    } catch (error) {
        return next(error)
    }

}

export const newTipNotification = async(userId,userToNotifyId,numOfTuales,next)=>{

    try {
        const userToNotify = await NotificationModel.findOne({user:userToNotifyId});

        const newNotification = {
            type: "newTip",
            user: userId, 
            date: Date.now(),
            numOfTuales
        }

        await userToNotify.notifications.unshift(newNotification);
        await userToNotify.save();
        await setNotificationToUnread(userToNotifyId,next)
        return;
    } catch (error) {
        return next(error)
    }

}


export const newTualeNotification = async(userId,postId,userToNotifyId,next)=>{

    try {
        const userToNotify = await NotificationModel.findOne({user:userToNotifyId});

        const newNotification = {
            type: "newTuale",
            user: userId,
            post: postId,
            date: Date.now(),
        }

        await userToNotify.notifications.unshift(newNotification);
        await userToNotify.save();
        await setNotificationToUnread(userToNotifyId,next)
        return;
    } catch (error) {
        return next(error)
    }

}

export const newTualeNotificationPrivate = async(userId,postId,userToNotifyId,next)=>{

    try {
        const userToNotify = await NotificationModel.findOne({user:userToNotifyId});

        const newNotification = {
            type: "newTualePrivate",
            user: userId,
            post: postId,
            date: Date.now(),
        }

        await userToNotify.notifications.unshift(newNotification);
        await userToNotify.save();
        await setNotificationToUnread(userToNotifyId,next)
        return;
    } catch (error) {
        return next(error)
    }

}

export const newStarNotification = async(userId,postId,userToNotifyId,next)=>{

    try {
        const userToNotify = await NotificationModel.findOne({user:userToNotifyId});

        const newNotification = {
            type: "newStarred",
            user: userId,
            post: postId,
            date: Date.now(),
        }

        await userToNotify.notifications.unshift(newNotification);
        await userToNotify.save();
        await setNotificationToUnread(userToNotifyId,next)
        return;
    } catch (error) {
        return next(error)
    }

}

export const newStarNotificationPrivate = async(userId,postId,userToNotifyId,next)=>{

    try {
        const userToNotify = await NotificationModel.findOne({user:userToNotifyId});

        const newNotification = {
            type: "newStarredPrivate",
            user: userId,
            post: postId,
            date: Date.now(),
        }

        await userToNotify.notifications.unshift(newNotification);
        await userToNotify.save();
        await setNotificationToUnread(userToNotifyId,next)
        return;
    } catch (error) {
        return next(error)
    }

}

export const removeStarNotification = async(userId,postId,userToNotifyId,next)=>{

    try {
        const user = await NotificationModel.findOne({user:userToNotifyId});

        const notificationToRemove = user.notifications.find(notification=>
            notification.type === "newStarred" 
            && notification.post.toString() === postId 
            && notification.user.toString() === userId)
       
        let indexOfNotificationToRemove = user.notifications
        .map(notification=>notification._id.toString())
        .indexOf(notificationToRemove._id.toString())
        
        await user.notifications.splice(indexOfNotificationToRemove,1);
        await user.save();

        return;
    } catch (error) {
        return next(error)
    }

}

export const removeStarNotificationPrivate = async(userId,postId,userToNotifyId,next)=>{

    try {
        const user = await NotificationModel.findOne({user:userToNotifyId});

        const notificationToRemove = user.notifications.find(notification=>
            notification.type === "newStarredPrivate" 
            && notification.post.toString() === postId 
            && notification.user.toString() === userId)
       
        let indexOfNotificationToRemove = user.notifications
        .map(notification=>notification._id.toString())
        .indexOf(notificationToRemove._id.toString())
        
        await user.notifications.splice(indexOfNotificationToRemove,1);
        await user.save();

        return;
    } catch (error) {
        return next(error)
    }

}

export const newCommentNotification = async(postId,commentId,userId,userToNotifyId,text,next)=>{

    try {
        const userToNotify = await NotificationModel.findOne({user:userToNotifyId});

        const newNotification = {
            type: "newComment",
            user: userId,
            post: postId,
            commentId,
            text,
            date: Date.now(),
        }

        await userToNotify.notifications.unshift(newNotification);
        await userToNotify.save();
        await setNotificationToUnread(userToNotifyId,next)
        return;
    } catch (error) {
        return next(error)
    }

}

export const newCommentNotificationPrivate = async(postId,commentId,userId,userToNotifyId,text,next)=>{

    try {
        const userToNotify = await NotificationModel.findOne({user:userToNotifyId});

        const newNotification = {
            type: "newCommentPrivate",
            user: userId,
            post: postId,
            commentId,
            text,
            date: Date.now(),
        }

        await userToNotify.notifications.unshift(newNotification);
        await userToNotify.save();
        await setNotificationToUnread(userToNotifyId,next)
        return;
    } catch (error) {
        return next(error)
    }

}

export const removeCommentNotification = async(postId,commentId,userId,userToNotifyId,next)=>{

    try {
        const user = await NotificationModel.findOne({user:userToNotifyId});

        const notificationToRemove = user.notifications.find(notification=>
            notification.type === "newComment" 
            && notification.post.toString() === postId 
            && notification.user.toString() === userId
            && notification.commentId === commentId)
       
        let indexOfNotificationToRemove = user.notifications
        .map(notification=>notification._id.toString())
        .indexOf(notificationToRemove._id.toString())
        
        await user.notifications.splice(indexOfNotificationToRemove,1);
        await user.save();

  
    } catch (error) {
        return next(error)
    }

}

export const removeCommentNotificationPrivate = async(postId,commentId,userId,userToNotifyId,next)=>{

    try {
        const user = await NotificationModel.findOne({user:userToNotifyId});

        const notificationToRemove = user.notifications.find(notification=>
            notification.type === "newCommentPrivate" 
            && notification.post.toString() === postId 
            && notification.user.toString() === userId
            && notification.commentId === commentId)
       
        let indexOfNotificationToRemove = user.notifications
        .map(notification=>notification._id.toString())
        .indexOf(notificationToRemove._id.toString())
        
        await user.notifications.splice(indexOfNotificationToRemove,1);
        await user.save();

  
    } catch (error) {
        return next(error)
    }

}

export const newFanNotification = async(userId,userToNotifyId,next)=>{

    try {
        const userToNotify = await NotificationModel.findOne({user:userToNotifyId});

        const newNotification = {
            type: "newFan",
            user: userId,
            date: Date.now(),
        }

        await userToNotify.notifications.unshift(newNotification);
        await userToNotify.save();
        await setNotificationToUnread(userToNotifyId,next)
        return;
    } catch (error) {
        return next(error)
    }

}

export const removeFanNotification = async(userId,userToNotifyId,next)=>{

    try {
        const user = await NotificationModel.findOne({user:userToNotifyId});

        const notificationToRemove = user.notifications.find(notification=>
            notification.type === "newFan" 
            && notification.user.toString() === userId
        )
       
        let indexOfNotificationToRemove = user.notifications
        .map(notification=>notification._id.toString())
        .indexOf(notificationToRemove._id.toString())
        
        await user.notifications.splice(indexOfNotificationToRemove,1);
        await user.save();

  
    } catch (error) {
        return next(error)
    }

}