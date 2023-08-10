import React, { useEffect } from 'react';
import { ModalController, Modal, ModalHeader, ModalBody, ModalFooter, Button } from '@backyard/react'
/**
 * Example Modal Component holding an open state and providing it to
 * `ModalController` to handle positioning and opening/closing of modal
 */ 
 const ShowModal = ({openStatus, closeCB}) =>  {
    // React open state
    const [open, setOpen] = React.useState(false)
    // Clicking the button opens the modal

    useEffect(() => {
        setOpen(openStatus)
    });

       return (
        <React.Fragment>
            <ModalController
                open={open}
                onClose={() => {
                        setOpen(false)
                        closeCB()
                    }
                }
                onOpen={() => setOpen(true)}
                modal={(
                    <Modal
                        size="medium"
                    >
                        <ModalHeader
                            label="Label"
                        >
                            Modal Title
                        </ModalHeader>
                        <ModalBody>
                            The body of the modal.
                        </ModalBody>
                        <ModalFooter>
                            <Button
                                variant="secondary"
                                color="contrast"
                                onClick={() => {
                                        setOpen(false)
                                        closeCB()
                                    }
                                }
                            >
                                Cancel
                            </Button>
                            <Button>
                                Save
                            </Button>
                        </ModalFooter>
                    </Modal>
                )}
            />
        </React.Fragment>
    )
}

export default ShowModal