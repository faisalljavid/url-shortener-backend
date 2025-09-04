const ORGANIZATIONSModel = require("./../models/organizations.model")

const IsOrganizationPresentUsingOrgDomainService = async (organizationDomain)=>{
    try{

        const organization = await ORGANIZATIONSModel.findOne({domain : organizationDomain}).exec()

        if(organization){
            return {
                success : true,
                data : organization
            }
        }else{
            throw new Error(`Unable to get organization details for domain : ${organizationDomain}`)
        }

    }catch(err){
        console.log(`Error in isOrganizationPresentUsingOrgDomainService with err : ${err}`)
        return {
            success : false
        }
    }
}

const CreateNewOrganizationService = async (organizationDomain, organizationName)=>{
    try{

        const organizationDetails = {
            name : organizationName
        };

        // --- MODIFIED LOGIC ---
        // Only add the 'domain' field to the database document if a valid 
        // domain string is provided. This prevents issues when creating personal
        // organizations that don't have a domain.
        if (organizationDomain) {
            organizationDetails.domain = organizationDomain;
        }

        const organization = await ORGANIZATIONSModel.create(organizationDetails);

        if(organization){
            return {
                success : true,
                data : organization
            }
        }else{
            throw new Error(`Unable to create organization for name : ${organizationName}`)
        }

    }catch(err){
        console.error(`Error in CreateNewOrganizationService with err : ${err.message}`);
        return {
            success : false,
            message: err.message
        }
    }
}

module.exports = {
    IsOrganizationPresentUsingOrgDomainService,
    CreateNewOrganizationService
}
