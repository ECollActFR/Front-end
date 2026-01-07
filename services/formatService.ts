export const formatService = {
    formatDate(dateString?: string) {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    },

    formatRoles(roles: string[]) {
        return roles.map(role => role.replace('ROLE_', '')).join(', ');
    }
}