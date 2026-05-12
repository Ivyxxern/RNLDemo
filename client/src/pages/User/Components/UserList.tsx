import type { FC } from "react";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../components/Table";
import type { UserColumns } from "../../../interfaces/UserColumns";
import UserService from "../../../services/UserService";
import Spinner from "../../../components/Spinner/Spinner";

interface UserListProps {
  onAddUser: () => void;
}

const UserList: FC<UserListProps> = ({ onAddUser }) => {
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [users, setUsers] = useState<UserColumns[]>([]);

  const handleLoadUsers = async () => {
    try {
      setLoadingUsers(true);
      const res = await UserService.loadUsers();
      if (res.status == 200) {
        setUsers(res.data.users);
      } else {
        console.error(
          "Unexpected status error occurred during loading users: ",
          res.status,
        );
      }
    } catch (error) {
      console.error(
        "Unexpected server error occurred during loading users: ",
        error,
      );
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleUserFullNameFormat = (user: UserColumns) => {
    let fullName = ''

    if(user.middle_name) {
      fullName = `${user.last_name}, ${
        user.first_name
      } ${user.middle_name.charAt(0)}.`;
    } else {
      fullName = `${user.last_name}, ${user.first_name}`;
    }

    // Doe, John

    if(user.suffix_name) {
      fullName += ` ${user.suffix_name}`;
    }

    // Doe, John Jr.

    return fullName;
  };

  useEffect(() => {
    handleLoadUsers();
  }, []);

  return (
    <>
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <div className="max-w-full overflow-x-auto">
          <Table>
            <caption className="mb-4">
              <div className="border-b border-gray-100">
                <div className="flex justify-end p-4">
                  <button
                    type="button"
                    className="cursor-pointer rounded-lg bg-blue-600 px-4 py-2 font-medium text-white shadow-lg transition hover:bg-blue-700"
                    onClick={onAddUser}
                  >
                    Add User
                  </button>
                </div>
              </div>
            </caption>
            <TableHeader className="bg-blue-600 text-white">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-5 py-2.5 text-center text-xs font-semibold uppercase tracking-wide"
                >
                  No.
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-2.5 text-center text-xs font-semibold uppercase tracking-wide"
                >
                  Full Name
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-2.5 text-center text-xs font-semibold uppercase tracking-wide"
                >
                  Gender
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-2.5 text-center text-xs font-semibold uppercase tracking-wide"
                >
                  Birth Date
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-2.5 text-center text-xs font-semibold uppercase tracking-wide"
                >
                  Age
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-2.5 text-center text-xs font-semibold uppercase tracking-wide"
                >
                  Action
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 text-sm text-gray-600">
              {loadingUsers ? (
                <TableRow>
                  <TableCell colSpan={6} className="px-4 py-3 text-center">
                    <Spinner size="md" />
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user, index) => (
                  <TableRow className="hover:bg-gray-100" key={index}>
                    <TableCell className="px-4 py-3 text-center">
                      {index + 1}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start">
                      {handleUserFullNameFormat(user)}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start">
                      {user.gender.gender}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start">
                      {user.birth_date}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start">
                      {user.age}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-center">
                      <div className="flex gap-4">
                      <button 
                      type="button"
                       className="text-green-600 font-medium cursor-pointer hover:underline"
                       >
                        Edit
                        </button>
                        <button
                        type="button"
                        className="text-red-600 font-medium cursor-pointer hover:underline"
                        >
                          Delete
                        </button>

                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
};

export default UserList;
