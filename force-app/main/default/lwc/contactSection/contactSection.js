import { LightningElement, track } from 'lwc';
import createLead from '@salesforce/apex/ContactFormController.createLead';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class ContactSection extends LightningElement {
    @track form = {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        description: ''
    };
    submitting = false;

    get submitLabel() {
        return this.submitting ? 'Sending…' : 'Send Message';
    }

    // ⭐ FIX 1: Correctly handles input and updates the tracked 'form' object.
    handleChange = (e) => {
        const { name, value } = e.target || {};
        if (!name) return;
        
        // This spreads the existing form state and overwrites only the field that changed.
        this.form = { ...this.form, [name]: (value ?? '').toString() };
    };

    // Validate, then submit FROM STATE
    handleSubmit = async (e) => {
        e.preventDefault();

        // 1. Validation check
        const controls = [
            ...this.template.querySelectorAll('lightning-input, lightning-textarea, lightning-combobox')
        ];
        const allValid = controls.reduce((ok, c) => {
            c.reportValidity();
            return ok && c.checkValidity();
        }, true);
        if (!allValid) return;

        // 2. Build LWC payload
        const payload = {
            salutation: null,
            firstName: this.form.firstName?.trim() || '',
            lastName: this.form.lastName?.trim() || '',
            email: this.form.email?.trim() || '',
            phone: this.form.phone?.trim() || '',
            description: this.form.description?.trim() || '',
            company: 'Website Inquiry' // your default
        };

        console.log('Submitting payload:', JSON.stringify(payload)); 

        this.submitting = true;
        try {
            // ⭐ FIX 2: Explicitly pass the arguments to match the Apex method signature.
            await createLead({
                salutation: payload.salutation,
                firstName: payload.firstName,
                lastName: payload.lastName,
                email: payload.email,
                phone: payload.phone,
                description: payload.description,
                company: payload.company
            });

            this.dispatchEvent(new ShowToastEvent({
                title: 'Thanks!',
                message: 'Your message has been sent.',
                variant: 'success'
            }));

            // clear UI and state
            controls.forEach((c) => { try { c.value = ''; } catch {} });
            this.form = { firstName: '', lastName: '', email: '', phone: '', description: '' };
        } catch (err) {
            this.dispatchEvent(new ShowToastEvent({
                title: 'Could not send',
                message: err?.body?.message || err?.message || 'Something went wrong.',
                variant: 'error'
            }));
        } finally {
            this.submitting = false;
        }
    };
}