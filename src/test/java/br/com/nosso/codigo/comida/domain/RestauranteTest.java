package br.com.nosso.codigo.comida.domain;

import static org.assertj.core.api.Assertions.assertThat;

import br.com.nosso.codigo.comida.TestUtil;
import org.junit.jupiter.api.Test;

public class RestauranteTest {

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Restaurante.class);
        Restaurante restaurante1 = new Restaurante();
        restaurante1.id = 1L;
        Restaurante restaurante2 = new Restaurante();
        restaurante2.id = restaurante1.id;
        assertThat(restaurante1).isEqualTo(restaurante2);
        restaurante2.id = 2L;
        assertThat(restaurante1).isNotEqualTo(restaurante2);
        restaurante1.id = null;
        assertThat(restaurante1).isNotEqualTo(restaurante2);
    }
}
