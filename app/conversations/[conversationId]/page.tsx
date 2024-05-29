import getConversationById from "@/app/actions/getConversationById";
import getMessages from "@/app/actions/getMessages";
import EmptyState from "@/app/components/EmptyState";
import Header from "./_components/Header";
import Body from "./_components/Body";
import Form from "./_components/Form";

interface Iparams {
    conversationId: string;
}


const conversationId = async ({params} : {params: Iparams}) => {


    const conversation = await getConversationById(params.conversationId)

    const messages = await getMessages(params.conversationId)


    if(!conversation){
        return (
            <div className="lg:pl-80 h-full">
                <div className="h-full flex flex-col">
                    <EmptyState/>
                </div>
            </div>
        )
    }





    return (
        <div className="lg:pl-80 h-full">
            <div className="h-screen flex  flex-col">
                <Header conversation={conversation} />
                <Body initialMessages = {messages} />
                <Form />
            </div>
        </div>
    )
}


export default conversationId;