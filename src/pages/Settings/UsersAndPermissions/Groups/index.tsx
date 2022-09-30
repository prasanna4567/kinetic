import { ColumnDef } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import Stack from "@mui/material/Stack";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import Typography from "@mui/material/Typography";
import { startCase } from "lodash-es";
import * as Yup from "yup";
import { FastField, Field, Form, Formik, FormikConfig } from "formik";
import LoadingButton from "@mui/lab/LoadingButton";
import Button from "@mui/material/Button";

import { Table, TableContainer, useTableState } from "@components/Table";
import { useShop } from "@containers/ShopProvider";
import { useGetGroupsQuery, useUpdateGroupMutation } from "@graphql/generates";
import { client } from "@graphql/graphql-request-client";
import { filterNodes } from "@utils/common";
import { Group } from "types/group";
import { Drawer } from "@components/Drawer";
import { TextField } from "@components/TextField";
import { useToast } from "@containers/ToastProvider";

import { normalizeRoles, RoleItem, RoleSelectField } from "./RoleSelectField";

type GroupFormValues = {
  name: string
  description?: string
  permissions: Record<string, RoleItem[]>
};

const groupSchema = Yup.object().shape({
  name: Yup.string().required("This field is required")
});

const Groups = () => {
  const [activeRow, setActiveRow] = useState<Group>();

  const { pagination, handlePaginationChange } = useTableState();
  const { shopId } = useShop();
  const toast = useToast();

  const { data, isLoading, refetch } = useGetGroupsQuery(client, { shopId: shopId! }, {
    select: (response) => {
      const validGroups = filterNodes(response.groups?.nodes);
      return {
        groups: validGroups,
        totalCount: response.groups?.totalCount
      };
    }
  });

  const { mutate: updateGroup } = useUpdateGroupMutation(client);

  const columns = useMemo((): ColumnDef<Group>[] => [
    {
      accessorKey: "name",
      header: "Name",
      cell: (info) => startCase(info.getValue())
    }
  ], []);

  const handleSubmit: FormikConfig<GroupFormValues>["onSubmit"] = async (
    values,
    { setSubmitting }
  ) => {
    if (activeRow) {
      const permissions = Object.values(values.permissions).flat().map(({ name }) => name);

      updateGroup({ input: { groupId: activeRow._id || "", group: { ...values, permissions }, shopId } }, {
        onSettled: () => setSubmitting(false),
        onSuccess: () => {
          setActiveRow(undefined);
          refetch();
          toast.success("Update group successfully.");
        }
      });
    }
  };

  return (
    <TableContainer>
      <TableContainer.Header
        title="Groups"
      />
      <Table
        columns={columns}
        data={data?.groups ?? []}
        loading={isLoading}
        tableState={{ pagination }}
        onPaginationChange={handlePaginationChange}
        totalCount={data?.totalCount}
        onRowClick={setActiveRow}
        emptyPlaceholder={
          <Stack alignItems="center" gap={2}>
            <AdminPanelSettingsOutlinedIcon sx={{ color: "grey.500", fontSize: "42px" }} />
            <div>
              <Typography variant="h6" gutterBottom>No Users</Typography>
              <Typography variant="body2" color="grey.600">Invite the first user.</Typography>
            </div>
          </Stack>}
      />
      <Drawer
        open={!!activeRow}
        onClose={() => setActiveRow(undefined)}
        title="Edit Group"
      >
        <Formik<GroupFormValues>
          onSubmit={handleSubmit}
          initialValues={{
            name: activeRow?.name || "",
            description: activeRow?.description || "",
            permissions: normalizeRoles(filterNodes(activeRow?.permissions))
          }}
          validationSchema={groupSchema}
        >
          {({ isSubmitting, dirty }) => (
            <Stack component={Form} flex={1}>
              <Drawer.Content>
                <Typography
                  variant="body2"
                  sx={{ color: "grey.700" }}
                  gutterBottom
                >
                  Control the permissions that are assigned to
                  a specific group. Users then get assigned to groups and have access to the resources via those groups.
                </Typography>
                <Field
                  component={TextField}
                  name="name"
                  label="Name"
                  placeholder="Enter group name"
                />
                <Field
                  component={TextField}
                  name="description"
                  label="Description"
                  placeholder="Enter group description"
                  rows={2}
                  multiline
                />
                <FastField name="permissions" component={RoleSelectField}/>
              </Drawer.Content>
              <Drawer.Actions
                right={
                  <Stack direction="row" gap={1}>
                    <Button
                      size="small"
                      variant="outlined"
                      color="secondary"
                      disabled={isSubmitting}
                      onClick={() => setActiveRow(undefined)}
                    >
                      Cancel
                    </Button>
                    <LoadingButton
                      size="small"
                      variant="contained"
                      type="submit"
                      loading={isSubmitting}
                      disabled={!dirty}
                    >
                      Save Changes
                    </LoadingButton>
                  </Stack>
                }
              />
            </Stack>
          )}
        </Formik>
      </Drawer>
    </TableContainer>
  );
};

export default Groups;
