import { useEffect, useState, type FC } from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../../components/Table"
import type { GenderColoumns } from "../../../interfaces/GenderColumns";
import GenderService from "../../../services/GenderServices";
import Spinner from "../../../components/Spinner/Spinner";
import { Link } from "react-router-dom";

interface GenderListProps {
  refreshKey: boolean;
}

const GenderList: FC<GenderListProps> = ({ refreshKey }) => {
  const [loadingGenders, setLoadingGenders] = useState(false);
  const [genders, setGenders] = useState<GenderColoumns[]>([]);

  const handleLoadGenders = async () => {
    const loadingStart = Date.now();
    const minimumLoadingTimeMs = 500;

    try {
      setLoadingGenders(true)

      const res = await GenderService.loadGenders()

      if (res.status === 200) {
        setGenders(res.data.genders)
      } else {
        console.error('Unexpected status error  occured during loading genders: ', res.status)
      }
    } catch (error) {
      console.error('Unexpected server error occured during loading genders', error)
    } finally {
      const elapsedMs = Date.now() - loadingStart;
      if (elapsedMs < minimumLoadingTimeMs) {
        await new Promise((resolve) => setTimeout(resolve, minimumLoadingTimeMs - elapsedMs));
      }
      setLoadingGenders(false);
    }
  };

  useEffect(() => {
    handleLoadGenders();
  }, [refreshKey]);

  return (
    <div className="relative overflow-hidden rounded-lg border border-gray-200 bg-white">
      {loadingGenders && genders.length > 0 ? (
        <div className="pointer-events-none absolute right-3 top-3 flex items-center gap-2 rounded-md border border-gray-200 bg-white/95 px-3 py-1.5 text-xs text-gray-600 shadow-sm">
          <Spinner size="xs" />
          <span>Refreshing...</span>
        </div>
      ) : null}
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="bg-blue-600 text-white">
            <TableRow>

              <TableCell isHeader className="px-5 py-2.5 text-center text-xs font-semibold uppercase tracking-wide"
              >
                No.
              </TableCell>

              <TableCell isHeader className="px-4 py-2.5 text-center text-xs font-semibold uppercase tracking-wide"
              >
                Gender
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-start"
              >
                Action
              </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-100 text-sm text-gray-600">
            {genders.length === 0 && loadingGenders ? (
              <TableRow>
                <TableCell className="px-4 py-3 text-center" colSpan={2}>
                  <Spinner size="md" />
                </TableCell>
              </TableRow>
            ) : genders.length === 0 ? (
              <TableRow>
                <TableCell className="px-4 py-3 text-center text-gray-400" colSpan={2}>
                  No genders found.
                </TableCell>
              </TableRow>
            ) : genders.map((gender, index) => (
              <TableRow className="hover:bg-gray-100" key={index}>
                <TableCell className="px-4 py-3 text-center">
                  {index + 1}
                </TableCell>
                <TableCell className="px-4 py-3 text-center">
                  {gender.gender}
                </TableCell>
                <TableCell className="px-4 py-3 text-center">
                  <div className="flex justify-center items-center gap-4">
                    <Link to={`/gender/edit/${gender.gender_id}`}
                      className="text-green-600 font-medium hover:underline"
                    >
                      Edit
                    </Link>
                    <Link to={`/gender/delete/${gender.gender_id}`} className="text-red-600 font-medium hover:underline">Delete</Link>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default GenderList