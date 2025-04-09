import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import Peer from "simple-peer";
import { useSelector } from "react-redux";
import { useParams } from "react-router";

window.global = window;

const socket = io("http://localhost:3333");

const VideoChat = () => {
    const [stream, setStream] = useState(null);
    const [receivingCall, setReceivingCall] = useState(false);
    const [caller, setCaller] = useState("");
    const [callerSignal, setCallerSignal] = useState(null);
    const [callAccepted, setCallAccepted] = useState(false);

    const user = useSelector((state) => state.user);
    const userId = user?._id;
    const { targetUserId } = useParams();

    const userVideo = useRef();
    const myVideo = useRef();
    const connectionRef = useRef();

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
            setStream(stream);
            if (myVideo.current) myVideo.current.srcObject = stream;
        });

        socket.on("incomingCall", (data) => {
            console.log("Incoming Call from:", data.from);
            setReceivingCall(true);
            setCaller(data.from); // ✅ Fix: Set correct caller ID
            setCallerSignal(data.signal);
        });

        socket.on("callAccepted", (signal) => {
            console.log("Call Accepted, applying signal...");
            setCallAccepted(true);
            connectionRef.current?.signal(signal);
        });
    }, []);

const callUser = (targetUserId) => {
    if (!stream) {
        console.error("No stream available. Cannot start call.");
        return;
    }

    console.log("Starting call with:", targetUserId);
    console.log("My Stream:", stream);
    
    const peer = new Peer({
        initiator: true,
        trickle: true,
        stream: stream,  // ✅ Ensure stream is passed correctly
    });

    peer.on("signal", (data) => {
        console.log("Sending offer to:", targetUserId);
        socket.emit("callUser", {
            userToCall: targetUserId,
            signalData: data,
            from: userId,
        });
    });

    peer.on("stream", (userStream) => {
        console.log("Receiving remote stream...");
        userVideo.current.srcObject = userStream;
    });

    connectionRef.current = peer;
};


    const answerCall = () => {
        console.log("Answering Call from:", caller);
        setCallAccepted(true);
        const peer = new Peer({ initiator: false, trickle: false, stream });

        peer.on("signal", (data) => {
            console.log("Sending Answer Signal to:", caller);
            socket.emit("answerCall", { signal: data, to: caller });
        });

        peer.on("stream", (userStream) => {
            if (userVideo.current) userVideo.current.srcObject = userStream;
        });

        peer.signal(callerSignal);
        connectionRef.current = peer;
    };

    return (
        <div>
            <h2>Video Chat</h2>
            <div>
                <video ref={myVideo} muted autoPlay playsInline style={{ width: "300px" }} />
                {callAccepted && <video ref={userVideo} autoPlay playsInline style={{ width: "300px" }} />}
            </div>
            <button onClick={() => callUser(targetUserId)}>Call</button>
            {receivingCall && <button onClick={answerCall}>Answer</button>}
        </div>
    );
};

export default VideoChat;
