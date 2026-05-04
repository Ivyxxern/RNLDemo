import type { FC } from "react";
import { useCallback, useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../components/Table";
import UserService from "../../../services/UserService";

export interface UserListRow {
  user_id: number;
  first_name: string;
  middle_name: string;
  last_name: string;
  suffix_name: string;
  gender: string;
  birth_date: string | null;
  age: number;
  username: string;
}

interface UserListProps {
  onAddUser: () => void;
  refreshTrigger?: number;
}

const UserList: FC<UserListProps> = ({ onAddUser, refreshTrigger = 0 }) => {
  const [users, setUsers] = useState<UserListRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const res = await UserService.loadUsers();
      if (res.status === 200 && Array.isArray(res.data?.users)) {
        setUsers(res.data.users as UserListRow[]);
      } else {
        setLoadError("Could not load users.");
      }
    } catch {
      setLoadError("Could not load users.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchUsers();
  }, [fetchUsers, refreshTrigger]);

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
                  First Name
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-2.5 text-center text-xs font-semibold uppercase tracking-wide"
                >
                  Middle Name
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-2.5 text-center text-xs font-semibold uppercase tracking-wide"
                >
                  Last Name
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-2.5 text-center text-xs font-semibold uppercase tracking-wide"
                >
                  Suffix Name
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
                  Username
                </TableCell>
                <TableCell isHeader className="px-5 py-3 text-center font-medium">
                  Action
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 text-sm text-gray-600">
              {loading ? (
                <TableRow>
                  <TableCell colSpan={10} className="px-4 py-8 text-center">
                    Loading users…
                  </TableCell>
                </TableRow>
              ) : loadError ? (
                <TableRow>
                  <TableCell colSpan={10} className="px-4 py-8 text-center text-red-600">
                    {loadError}
                  </TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="px-4 py-8 text-center text-gray-500">
                    No users yet. Click Add User to create one.
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow className="hover:bg-gray-50" key={user.user_id}>
                    <TableCell className="px-4 py-2.5 text-center">{user.user_id}</TableCell>
                    <TableCell className="px-4 py-2.5 text-center">{user.first_name}</TableCell>
                    <TableCell className="px-4 py-2.5 text-center">{user.middle_name}</TableCell>
                    <TableCell className="px-4 py-2.5 text-center">{user.last_name}</TableCell>
                    <TableCell className="px-4 py-2.5 text-center">{user.suffix_name}</TableCell>
                    <TableCell className="px-4 py-2.5">{user.gender}</TableCell>
                    <TableCell className="px-4 py-2.5 text-center">{user.birth_date ?? "—"}</TableCell>
                    <TableCell className="px-4 py-2.5 text-center">{user.age}</TableCell>
                    <TableCell className="px-4 py-2.5 text-center">{user.username}</TableCell>
                    <TableCell className="px-4 py-3 text-start">
                      <div className="flex gap-4">
                        <button
                          type="button"
                          className="cursor-pointer font-medium text-green-600 hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="cursor-pointer font-medium text-red-600 hover:underline"
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
