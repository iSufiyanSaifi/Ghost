import { MobileInput } from "@/components/ghost/mobile-input"
import { Button } from "@/components/ui/button"
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field"
import {
  FocusModal,
  FocusModalBody,
  FocusModalClose,
  FocusModalContent,
  FocusModalDescription,
  FocusModalFooter,
  FocusModalHeader,
  FocusModalTitle,
  FocusModalTrigger,
} from "@/components/ui/focus-modal"
import { Input } from "@/components/ui/input"

export default function FocusModalDemo() {
  return (
    <FocusModal>
      <FocusModalTrigger asChild>
        <Button>Create service order</Button>
      </FocusModalTrigger>
      <FocusModalContent>
        <form
          className="flex min-h-0 flex-1 flex-col"
          onSubmit={(event) => event.preventDefault()}
        >
          <FocusModalHeader>
            <FocusModalTitle className="sr-only">Create service order</FocusModalTitle>
            <span className="text-sm text-muted-foreground">Bay 3 · Draft</span>
          </FocusModalHeader>
          <FocusModalBody className="px-4 py-8">
            <div className="mx-auto flex w-full max-w-md flex-col gap-6">
              <div className="flex flex-col gap-1">
                <h2 className="text-xl font-medium text-foreground">Create service order</h2>
                <FocusModalDescription>
                  Add the customer and vehicle. You can add jobs and parts after saving.
                </FocusModalDescription>
              </div>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="focus-modal-name">Customer name</FieldLabel>
                  <Input id="focus-modal-name" name="name" placeholder="Sufiyan Jin" required />
                </Field>
                <Field>
                  <FieldLabel htmlFor="focus-modal-mobile">Mobile number</FieldLabel>
                  <MobileInput id="focus-modal-mobile" name="mobile" required />
                  <FieldDescription>10-digit mobile number, e.g. +91 97850 12345</FieldDescription>
                </Field>
                <Field>
                  <FieldLabel htmlFor="focus-modal-registration">Vehicle registration</FieldLabel>
                  <Input
                    id="focus-modal-registration"
                    name="registration"
                    placeholder="MH 12 AB 1234"
                    autoCapitalize="characters"
                    required
                  />
                </Field>
              </FieldGroup>
            </div>
          </FocusModalBody>
          <FocusModalFooter>
            <FocusModalClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </FocusModalClose>
            <Button type="submit">Save</Button>
          </FocusModalFooter>
        </form>
      </FocusModalContent>
    </FocusModal>
  )
}
