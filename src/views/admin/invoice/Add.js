import { CloseIcon, PhoneIcon } from "@chakra-ui/icons";
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  FormLabel,
  Grid,
  GridItem,
  Heading,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Text,
} from "@chakra-ui/react";
import { HSeparator } from "components/separator/Separator";
import Spinner from "components/spinner/Spinner";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { leadSchema } from "schema";
import { getApi } from "services/api";
import { postApi } from "services/api";
import { generateValidationSchema } from "utils";
import CustomForm from "utils/customForm";
import * as yup from "yup";

const Add = (props) => {
  const [isLoding, setIsLoding] = useState(false);

  // const initialValues = {
  //     // Lead Information:
  //     leadName: '',
  //     leadEmail: '',
  //     leadPhoneNumber: '',
  //     leadAddress: '',
  //     // Lead Source and Details:
  //     leadSource: '',
  //     leadStatus: '',
  //     leadSourceDetails: '',
  //     leadCampaign: '',
  //     leadSourceChannel: '',
  //     leadSourceMedium: '',
  //     leadSourceCampaign: '',
  //     leadSourceReferral: '',
  //     // Lead Assignment and Ownership:
  //     leadAssignedAgent: '',
  //     leadOwner: '',
  //     leadCommunicationPreferences: '',
  //     // Lead Dates and Follow-up:
  //     leadCreationDate: '',
  //     leadConversionDate: '',
  //     leadFollowUpDate: '',
  //     leadFollowUpStatus: '',
  //     // Lead Scoring and Nurturing:
  //     leadScore: '',
  //     leadNurturingWorkflow: '',
  //     leadEngagementLevel: '',
  //     leadConversionRate: '',
  //     leadNurturingStage: '',
  //     leadNextAction: '',
  //     createBy: JSON.parse(localStorage.getItem('user'))._id,
  // };

  // const initialFieldValues = Object.fromEntries(props?.leadData && props?.leadData?.fields?.length > 0 && props?.leadData?.fields?.map(field => [field?.name, '']))

  const initialFieldValues = Object.fromEntries(
    (props?.leadData?.fields || []).map((field) => [field?.name, ""])
  );

  const initialValues = {
    ...initialFieldValues,
    createBy: JSON.parse(localStorage.getItem("user"))._id,
  };

  const formik = useFormik({
    initialValues: initialValues,
    // validationSchema: validationSchema,
    validationSchema: yup
      .object()
      .shape(generateValidationSchema(props?.leadData?.fields)),
    onSubmit: (values, { resetForm }) => {
      AddData();
    },
  });

  const user = JSON.parse(localStorage.getItem("user"));

  const {
    errors,
    touched,
    values,
    handleBlur,
    handleChange,
    handleSubmit,
    setFieldValue,
  } = formik;

  const AddData = async () => {
    try {
      setIsLoding(true);

      const formValues = { ...values };
      if (user?.roles[0]?.roleName === "Manager") {
        formValues["managerAssigned"] = user?._id?.toString();
      }

      if (user?.roles[0]?.roleName === "Agent") {
        formValues["agentAssigned"] = user?._id?.toString();
      }
      // let response = await postApi('api/lead/add', values)
      formValues["leadStatus"] = "new";
      let response = await postApi("api/form/add", {
        ...formValues,
        moduleId: props?.leadData?._id,
      });
      if (response.status === 200) {
        props.onClose();
        formik.resetForm();
        props.fetchData();
        props.setAction((pre) => !pre);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoding(false);
    }
  };

  const handleCancel = () => {
    formik.resetForm();
    props.onClose();
  };

  return (
    <div>
      <Drawer isOpen={props.isOpen} size={props.size}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader justifyContent="space-between" display="flex">
            Add invoice
            <IconButton onClick={props.onClose} icon={<CloseIcon />} />
          </DrawerHeader>
          <DrawerBody>
            {/* <Grid templateColumns="repeat(12, 1fr)" gap={3}>
                            {props?.leadData?.headings?.length > 0 ?
                                <>
                                    {
                                        props?.leadData?.headings?.map((item, ind) => (
                                            <>
                                                <GridItem colSpan={{ base: 12 }}>
                                                    {ind !== 0 && <HSeparator />}
                                                    <Heading as="h1" size="md" >
                                                        {ind + 1}. {item?.heading}
                                                    </Heading>
                                                </GridItem>
                                                {
                                                    props?.leadData?.fields?.filter((itm) => itm?.belongsTo === item?._id)?.map((field) => (
                                                        <GridItem colSpan={{ base: 12, sm: 6 }}>
                                                            <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px' htmlFor={field?.name}>
                                                                {field.label} {field.validation && field.validation.find((validation) => validation.require) && (
                                                                    <span style={{ color: 'red' }}>*</span>
                                                                )}
                                                            </FormLabel>
                                                            <Input
                                                                id={field?.name}
                                                                name={field?.name}
                                                                type={field?.type}
                                                                value={values?.[field?.name]}
                                                                onChange={handleChange} onBlur={handleBlur}
                                                                fontSize='sm'
                                                                fontWeight='500'
                                                                borderColor={errors?.[field?.name] && touched?.[field?.name] ? "red.300" : null}
                                                                placeholder={`Enter ${field?.label}`}
                                                            />
                                                            {touched[field?.name] && errors?.[field?.name] ? (
                                                                <Text mb='10px' color={'red'}> {errors?.[field?.name]}</Text>
                                                            ) : null}
                                                        </GridItem>
                                                    ))
                                                }
                                            </>
                                        ))
                                    }
                                    {props?.leadData?.headings?.length > 0 &&
                                        props?.leadData?.headings?.map((item, ind) => (
                                            <>
                                                {props?.leadData?.fields?.filter((itm) => !itm?.belongsTo)?.map((field) => (
                                                    <GridItem colSpan={{ base: 12, sm: 6 }} key={field?.name}>
                                                        <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px' htmlFor={field?.name}>
                                                            {field.label} {field.validation && field.validation.find((validation) => validation.require) && (
                                                                <span style={{ color: 'red' }}>*</span>
                                                            )}
                                                        </FormLabel>
                                                        <Input
                                                            id={field?.name}
                                                            name={field?.name}
                                                            type={field?.type}
                                                            value={values?.[field?.name]}
                                                            onChange={handleChange} onBlur={handleBlur}
                                                            fontSize='sm'
                                                            fontWeight='500'
                                                            borderColor={errors?.[field?.name] && touched?.[field?.name] ? "red.300" : null}
                                                            placeholder={`Enter ${field?.label}`}
                                                        />
                                                        {touched[field?.name] && errors?.[field?.name] ? (
                                                            <Text mb='10px' color={'red'}> {errors?.[field?.name]}</Text>
                                                        ) : null}
                                                    </GridItem>
                                                ))}
                                            </>
                                        ))
                                    }
                                </>
                                :
                                props?.leadData?.fields?.map(field => (
                                    <GridItem colSpan={{ base: 12, sm: 6 }} key={field?.name}>
                                        <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px' htmlFor={field.name}>{field.label} {field.validation && field.validation.find((validation) => validation.require) && (
                                            <span style={{ color: 'red' }}>*</span>
                                        )}</FormLabel>
                                        <Input
                                            id={field?.name}
                                            name={field?.name}
                                            type={field?.type}
                                            value={values?.[field?.name]}
                                            onChange={handleChange} onBlur={handleBlur}
                                            fontSize='sm'
                                            fontWeight='500'
                                            borderColor={errors?.[field?.name] && touched?.[field?.name] ? "red.300" : null}
                                            placeholder={`Enter ${field?.label}`}
                                        />
                                        {touched[field?.name] && errors[field?.name] ? (
                                            <Text mb='10px' color={'red'}> {errors?.[field?.name]}</Text>
                                        ) : null}
                                    </GridItem>
                                ))
                            }
                        </Grid> */}
            <Grid templateColumns="repeat(12, 1fr)" gap={3}>
              <GridItem colSpan={{ base: 12, md: 6 }}>
                <Input
                  fontSize="sm"
                  type={"text"}
                  name={"unitNo"}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values["unitNo"]}
                  fontWeight="500"
                  placeholder={`Enter Unit No`}
                  borderColor={
                    errors?.["unitNo"] && touched?.["unitNo"] ? "red.300" : null
                  }
                />
              </GridItem>
              <GridItem colSpan={{ base: 12, md: 6 }}>
                <Select
                  fontSize="sm"
                  name={"developer"}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Select developer"
                  value={values["developer"] || null}
                  fontWeight="500"
                  borderColor={
                    errors?.["developer"] && touched?.["developer"]
                      ? "red.300"
                      : null
                  }
                ></Select>
              </GridItem>
              <GridItem colSpan={{ base: 12, md: 6 }}>
                <Input
                  fontSize="sm"
                  type={"number"}
                  name={"totalPrice"}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values["totalPrice"]}
                  fontWeight="500"
                  placeholder={`Enter Total Price`}
                  borderColor={
                    errors?.["totalPrice"] && touched?.["totalPrice"] ? "red.300" : null
                  }
                />
              </GridItem>
            </Grid>
          </DrawerBody>
          <DrawerFooter>
            <Button
              sx={{ textTransform: "capitalize" }}
              size="sm"
              disabled={isLoding ? true : false}
              variant="brand"
              type="submit"
              onClick={handleSubmit}
            >
              {isLoding ? <Spinner /> : "Save"}
            </Button>
            <Button
              variant="outline"
              colorScheme="red"
              size="sm"
              sx={{
                marginLeft: 2,
                textTransform: "capitalize",
              }}
              onClick={handleCancel}
            >
              Close
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default Add;
