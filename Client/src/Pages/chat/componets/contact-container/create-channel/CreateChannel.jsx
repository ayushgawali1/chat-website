import React, { useEffect, useState } from 'react'
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { FaPlus } from 'react-icons/fa'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { apiClient } from '@/lib/api-client';
import { CREATE_CHANNEL_ROUTE, GET_ALL_CONTACTS_ROUTES, HOST, SEARCH_CONTACTS_ROUTES } from '@/utils/constants';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAppStore } from '@/store';
import { Button } from '@/components/ui/button';
import MultipleSelector from '@/components/ui/multipleselect.jsx';


function CreateChannel() {

    const { setSelectedChatType, setSelectedChatData, addChannel } = useAppStore();

    const [newChannelModel, setNewChannelModel] = useState(false);

    const [allContacts, setAllContacts] = useState([]);
    const [selectedContacts, setSelectedContacts] = useState([]);
    const [channelName, setChannelName] = useState("");

    const getData = async () => {
        const response = await apiClient.get(GET_ALL_CONTACTS_ROUTES, {
            withCredentials: true,
        });
        console.log(response.data);

        setAllContacts(response.data.contacts);
    };

    const createChannel = async () => {
        try {
            if (channelName.length > 0 && selectedContacts.length > 0) {
                const response = await apiClient.post(
                    CREATE_CHANNEL_ROUTE,
                    {
                        name: channelName,
                        members: selectedContacts.map((contact) => contact.value),
                    },
                    { withCredentials: true }
                );
                if (response.status === 201) {
                    setChannelName("");
                    setSelectedContacts([]);
                    setNewChannelModel(false);
                    addChannel(response.data.channel);
                }
            }
        } catch (error) {
            console.log(error);

        }
    }

    useEffect(() => {
        getData();
    }, []);



    return (
        <>
            <Tooltip>
                <TooltipTrigger>
                    <FaPlus
                        className='text-neutral-400 font-light text-opacity-90 text-sm hover:text-neutral-100 transition-all duration-300 cursor-pointer'
                        onClick={() => setNewChannelModel(true)}
                    />
                </TooltipTrigger>
                <TooltipContent className=" p-3 text-white">
                    Create New Channel
                </TooltipContent>
            </Tooltip>
            <Dialog open={newChannelModel} onOpenChange={setNewChannelModel}>
                <DialogContent className="bg-[#181920] border-none text-white w-[400px] h-[400px] flex flex-col">
                    <DialogHeader>
                        <DialogTitle>Fill up the detils for New Channel</DialogTitle>
                        <DialogDescription></DialogDescription>
                    </DialogHeader>
                    <div>
                        <Input
                            placeholder="Channel Name"
                            className="rounded-lg p-6 bg-[#2c2e3b] border-none"
                            onChange={e => setChannelName(e.target.value)}
                            value={channelName}
                        />
                    </div>
                    <div>
                        <MultipleSelector
                            className="rounded-lg bg-[#2c2e3b] border-none py-2 text-white"
                            defaultOptions={allContacts}
                            placeholder="Search Contacts"
                            value={selectedContacts}
                            onChange={setSelectedContacts}
                            emptyIndicator={
                                <p className="text-center text-lg leading-10 text-gray-600">
                                    No results found.
                                </p>
                            }
                        />
                    </div>
                    <div>
                        <Button
                            className="w-full bg-purple-700 hover:bg-purple-900 transition-all duration-300"
                            onClick={createChannel}
                        >
                            Create Channel
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default CreateChannel