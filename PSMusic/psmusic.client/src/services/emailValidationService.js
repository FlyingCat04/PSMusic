const emailValidationService = {
    async validateEmail(email) {
        try {
            const apiKey = import.meta.env.VITE_ABSTRACT_API_KEY;
            const response = await fetch(
                `https:///emailreputation.abstractapi.com/v1/?api_key=${apiKey}&email=${email}`
            );
            
            const data = await response.json();
            return {
                isDeliverable: data.email_deliverability?.status === "deliverable" || false,
                isFormatValid: data.email_deliverability?.is_format_valid || false,
                isSMTPValid: data.email_deliverability?.is_smtp_valid || false,
                isGmail: data.email_sender?.organization_name === "Gmail" || false,
                message: data.email_deliverability?.status === "deliverable"
                    ? "Email hợp lệ" 
                    : "Email không tồn tại hoặc không thể gửi được"
            };
        } catch (error) {
            //console.error("Email validation error:", error);
            return {
                isDeliverable: false,
                isFormatValid: false,
                isSMTPValid: false,
                isGmail: false,
                message: ""
            };
        }
    }
};

export default emailValidationService;